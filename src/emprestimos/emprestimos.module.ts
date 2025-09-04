import { Module } from '@nestjs/common';
import { EmprestimosController } from './emprestimos.controller';
import { EmprestimosService } from './emprestimos.service';
import { FuncionariosModule } from '../funcionarios/funcionarios.module';
import { EmpresasModule } from '../empresas/empresas.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [FuncionariosModule, EmpresasModule, HttpModule],
  controllers: [EmprestimosController],
  providers: [EmprestimosService],
})
export class EmprestimosModule {}
