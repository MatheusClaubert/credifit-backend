// src/emprestimos/emprestimos.module.ts
import { Module } from '@nestjs/common';
import { EmprestimosController } from './emprestimos.controller';
import { EmprestimosService } from './emprestimos.service';
import { ScoreService } from './score.service';
import { PagamentoService } from './pagamento.service';

@Module({
  controllers: [EmprestimosController],
  providers: [EmprestimosService, ScoreService, PagamentoService],
})
export class EmprestimosModule {}
