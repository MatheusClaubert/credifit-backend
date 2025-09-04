import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { CriarFuncionarioDto } from './dto/criar-funcionario.dto';
import type { Funcionario } from './funcionario.entity';

@Controller('funcionarios')
export class FuncionariosController {
  constructor(private readonly funcionarios: FuncionariosService) {}

  @Post()
  criar(@Body() dto: CriarFuncionarioDto): Funcionario {
    return this.funcionarios.criar(dto);
  }

  @Get(':cpf')
  obter(@Param('cpf') cpf: string): Funcionario | undefined {
    return this.funcionarios.buscarPorCpf(cpf);
  }
}
