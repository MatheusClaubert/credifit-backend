// src/emprestimos/emprestimos.service.ts
import { Injectable } from '@nestjs/common';
import { CriarEmprestimoDto } from './dto/criar-emprestimo.dto';
import { ScoreService } from './score.service';
import { PagamentoService } from './pagamento.service';
import { Emprestimo, OpcaoParcelamento, Parcela } from './emprestimos.entity';


@Injectable()
export class EmprestimosService {
  private emprestimos: Emprestimo[] = [];
  private idCounter = 1;

  constructor(
    private readonly scoreService: ScoreService,
    private readonly pagamentoService: PagamentoService,
  ) {}

  solicitar(dados: CriarEmprestimoDto): Emprestimo {
    const { nome, cpf, salario, valorSolicitado } = dados;
    const createdAt = new Date();

    // 1) Margem consignável (35% do salário)
    const margemMax = salario * 0.35;
    if (valorSolicitado > margemMax) {
      const rejeitado: Emprestimo = {
        id: this.idCounter++,
        createdAt: createdAt.toISOString(),
        nome,
        cpf,
        salario,
        valorSolicitado,
        score: 0,
        aprovado: false,
        motivoRejeicao: `Valor solicitado excede a margem consignável (35%): máximo R$ ${margemMax.toFixed(
          2,
        )}.`,
      };
      this.emprestimos.push(rejeitado);
      return rejeitado;
    }

    // 2) Consultar score (mock)
    const score = this.scoreService.obterScore(cpf);

    // 3) Score mínimo por faixa
    let scoreMinimo = 0;
    if (salario <= 2000) scoreMinimo = 400;
    else if (salario <= 4000) scoreMinimo = 500;
    else if (salario <= 8000) scoreMinimo = 600;
    else scoreMinimo = 700; // >= 12000 também fica em 700

    if (score < scoreMinimo) {
      const rejeitado: Emprestimo = {
        id: this.idCounter++,
        createdAt: createdAt.toISOString(),
        nome,
        cpf,
        salario,
        valorSolicitado,
        score,
        aprovado: false,
        motivoRejeicao: `Score insuficiente (mínimo ${scoreMinimo}).`,
      };
      this.emprestimos.push(rejeitado);
      return rejeitado;
    }

    // 4) Aprovado → simula pagamento + gera opções de 1 a 4 vezes
    const pagamento = this.pagamentoService.processarPagamento(valorSolicitado);
    const opcoesParcelamento = this.gerarOpcoesParcelamento(
      valorSolicitado,
      createdAt,
    );

    const aprovado: Emprestimo = {
      id: this.idCounter++,
      createdAt: createdAt.toISOString(),
      nome,
      cpf,
      salario,
      valorSolicitado,
      score,
      aprovado: true,
      pagamento,
      opcoesParcelamento,
    };

    this.emprestimos.push(aprovado);
    return aprovado;
  }

  listar(): Emprestimo[] {
    // mais recente primeiro
    return [...this.emprestimos].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  // ---------- helpers ----------
  private gerarOpcoesParcelamento(
    valor: number,
    dataBase: Date,
  ): OpcaoParcelamento[] {
    const opcoes: OpcaoParcelamento[] = [];
    for (let vezes = 1; vezes <= 4; vezes++) {
      const parcelas = this.gerarParcelas(valor, vezes, dataBase);
      opcoes.push({ vezes, parcelas });
    }
    return opcoes;
  }

  private gerarParcelas(
    valorTotal: number,
    vezes: number,
    dataBase: Date,
  ): Parcela[] {
    const valorBase = this.round2(valorTotal / vezes);
    const parcelas: Parcela[] = [];

    // garante soma exata ajustando a última parcela
    for (let i = 1; i <= vezes; i++) {
      const venc = new Date(dataBase);
      venc.setMonth(venc.getMonth() + i); // 1º vencimento = +1 mês

      parcelas.push({
        numero: i,
        valor: valorBase,
        vencimento: venc.toISOString().slice(0, 10),
      });
    }

    const somaSemAjuste = this.round2(valorBase * vezes);
    const diferenca = this.round2(valorTotal - somaSemAjuste);
    if (Math.abs(diferenca) >= 0.01) {
      // ajusta a última parcela
      parcelas[parcelas.length - 1].valor = this.round2(
        parcelas[parcelas.length - 1].valor + diferenca,
      );
    }

    return parcelas;
    }

  private round2(n: number) {
    return Math.round(n * 100) / 100;
  }
}