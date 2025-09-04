import { Injectable, BadRequestException } from '@nestjs/common';
import { Funcionario } from './funcionario.entity';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';
import { EmpresasService } from '../empresas/empresas.service';

@Injectable()
export class FuncionariosService {
  private funcionarios: Funcionario[] = [];

  constructor(private readonly empresas: EmpresasService) {}

  criar(dto: CriarFuncionarioDto): Funcionario {
    // empresa precisa existir
    const empresa = this.empresas.buscarPorCnpj(dto.cnpjEmpresa);
    if (!empresa) throw new BadRequestException('Empresa conveniada não encontrada');

    // unicidade por CPF e e-mail
    const existeCpf = this.funcionarios.some(f => f.cpf === dto.cpf);
    const existeEmail = this.funcionarios.some(f => f.email === dto.email);
    if (existeCpf) throw new BadRequestException('CPF já cadastrado');
    if (existeEmail) throw new BadRequestException('E-mail já cadastrado');

    const funcionario: Funcionario = {
      cpf: dto.cpf,
      nomeCompleto: dto.nomeCompleto,
      email: dto.email,
      senha: dto.senha,
      salario: dto.salario,
      cnpjEmpresa: dto.cnpjEmpresa,
    };
    this.funcionarios.push(funcionario);
    return funcionario;
  }

  buscarPorCpf(cpf: string) {
    return this.funcionarios.find(f => f.cpf === cpf);
  }
}
