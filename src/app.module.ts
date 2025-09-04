import { Module } from '@nestjs/common';
import { EmprestimosModule } from './emprestimos/emprestimos.module';
import { EmpresasModule } from './empresas/empresas.module';
import { FuncionariosModule } from './funcionarios/funcionarios.module';

@Module({
  imports: [EmprestimosModule, EmpresasModule, FuncionariosModule],
})
export class AppModule {}
