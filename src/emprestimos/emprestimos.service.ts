import { Injectable, BadRequestException } from '@nestjs/common';
import type { Emprestimo, OpcaoParcelamento, Parcela } from './emprestimos.entity';
import { CriarEmprestimoDto } from './dto/criar-emprestimo.dto';
import { FuncionariosService } from '../funcionarios/funcionarios.service';
import { EmpresasService } from '../empresas/empresas.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class EmprestimosService {
  private emprestimos: Emprestimo[] = [];
  private idCounter = 1;

  private SCORE_URL = 'https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf';
  private PAGAMENTO_URL = 'https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c';

  constructor(
    private readonly funcionarios: FuncionariosService,
    private readonly empresas: EmpresasService,
    private readonly http: HttpService,
  ) {}

  async solicitar(dto: CriarEmprestimoDto): Promise<Emprestimo> {
    const createdAt = new Date();
    const funcionario = this.funcionarios.buscarPorCpf(dto.cpf);
    if (!funcionario) {
      throw new BadRequestException('Funcionário não encontrado');
    }

    // funcionário precisa estar vinculado a empresa conveniada existente
    const empresa = this.empresas.buscarPorCnpj(funcionario.cnpjEmpresa);
    if (!empresa) {
      throw new BadRequestException('Funcionário não vinculado a empresa conveniada válida');
    }

    // margem 35%
    const margemMax = funcionario.salario * 0.35;
    if (dto.valorSolicitado > margemMax) {
      const rejeitado: Emprestimo = {
        id: this.idCounter++,
        createdAt: createdAt.toISOString(),
        nome: funcionario.nomeCompleto,
        cpf: funcionario.cpf,
        salario: funcionario.salario,
        valorSolicitado: dto.valorSolicitado,
        score: 0,
        aprovado: false,
        motivoRejeicao: `Valor solicitado excede a margem consignável (35%): máximo R$ ${margemMax.toFixed(2)}.`,
      };
      this.emprestimos.push(rejeitado);
      return rejeitado;
    }

    // score via mock externo (fallback 650)
    const score = await this.obterScoreSeguro();

    // regra por faixa salarial
    const salario = funcionario.salario;
    let scoreMin = 0;
    if (salario <= 2000) scoreMin = 400;
    else if (salario <= 4000) scoreMin = 500;
    else if (salario <= 8000) scoreMin = 600;
    else scoreMin = 700;

    if (score < scoreMin) {
      const rejeitado: Emprestimo = {
        id: this.idCounter++,
        createdAt: createdAt.toISOString(),
        nome: funcionario.nomeCompleto,
        cpf: funcionario.cpf,
        salario,
        valorSolicitado: dto.valorSolicitado,
        score,
        aprovado: false,
        motivoRejeicao: `Score insuficiente (mínimo ${scoreMin}).`,
      };
      this.emprestimos.push(rejeitado);
      return rejeitado;
    }

    // pagamento via mock externo (fallback aprovado)
    const pagamentoOk = await this.processarPagamentoSeguro(dto.valorSolicitado);
    if (!pagamentoOk) {
      const rejeitado: Emprestimo = {
        id: this.idCounter++,
        createdAt: createdAt.toISOString(),
        nome: funcionario.nomeCompleto,
        cpf: funcionario.cpf,
        salario,
        valorSolicitado: dto.valorSolicitado,
        score,
        aprovado: false,
        motivoRejeicao: 'Gateway de pagamento indisponível',
      };
      this.emprestimos.push(rejeitado);
      return rejeitado;
    }

    const opcoesParcelamento = this.gerarOpcoesParcelamento(dto.valorSolicitado, createdAt);

    const aprovado: Emprestimo = {
      id: this.idCounter++,
      createdAt: createdAt.toISOString(),
      nome: funcionario.nomeCompleto,
      cpf: funcionario.cpf,
      salario,
      valorSolicitado: dto.valorSolicitado,
      score,
      aprovado: true,
      pagamento: { status: 'SUCESSO', transacaoId: `TX-${Date.now()}`, valor: dto.valorSolicitado },
      opcoesParcelamento,
    };

    this.emprestimos.push(aprovado);
    return aprovado;
  }

  listar(): Emprestimo[] {
    return [...this.emprestimos].sort((a,b)=> new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());
  }

  // ------------ helpers HTTP -------------
  private async obterScoreSeguro(): Promise<number> {
    try {
      const res = await firstValueFrom(this.http.get(this.SCORE_URL, { timeout: 3000 }));
      const score = Number(res.data?.score);
      return Number.isFinite(score) ? score : 650; // fallback
    } catch {
      return 650; // fallback
    }
  }

  private async processarPagamentoSeguro(valor: number): Promise<boolean> {
    try {
      const res = await firstValueFrom(this.http.post(this.PAGAMENTO_URL, { valor }, { timeout: 3000 }));
      const status = (res.data?.status || '').toString().toLowerCase();
      return status.includes('aprov');
    } catch {
      // fallback: aprovado
      return true;
    }
  }

  private gerarOpcoesParcelamento(valor: number, dataBase: Date): OpcaoParcelamento[] {
    const opcoes: OpcaoParcelamento[] = [];
    for (let vezes = 1; vezes <= 4; vezes++) {
      opcoes.push({ vezes, parcelas: this.gerarParcelas(valor, vezes, dataBase) });
    }
    return opcoes;
  }

  private gerarParcelas(valorTotal: number, vezes: number, dataBase: Date): Parcela[] {
    const base = this.round2(valorTotal / vezes);
    const parcelas: Parcela[] = [];
    for (let i = 1; i <= vezes; i++) {
      const venc = new Date(dataBase);
      venc.setMonth(venc.getMonth() + i);
      parcelas.push({
        numero: i,
        valor: base,
        vencimento: venc.toISOString().slice(0,10),
      });
    }
    // ajuste centavos na última
    const soma = this.round2(base * vezes);
    const dif = this.round2(valorTotal - soma);
    if (Math.abs(dif) >= 0.01) {
      parcelas[parcelas.length - 1].valor = this.round2(parcelas[parcelas.length - 1].valor + dif);
    }
    return parcelas;
  }

  private round2(n: number) { return Math.round(n * 100) / 100; }
}
