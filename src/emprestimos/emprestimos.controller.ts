// src/emprestimos/emprestimos.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { EmprestimosService } from './emprestimos.service';
import { CriarEmprestimoDto } from './dto/criar-emprestimo.dto';
import type { Emprestimo } from './emprestimos.entity';


@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimosService: EmprestimosService) {}

  @Post()
  solicitarEmprestimo(@Body() dados: CriarEmprestimoDto): Emprestimo {
    return this.emprestimosService.solicitar(dados);
  }

  @Get()
  listarEmprestimos(): Emprestimo[] {
    return this.emprestimosService.listar();
  }
}
