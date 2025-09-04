import { Module } from '@nestjs/common';
import { FuncionariosService } from './funcionarios.service';
import { FuncionariosController } from './funcionarios.controller';
import { EmpresasModule } from '../empresas/empresas.module';

@Module({
  imports: [EmpresasModule],
  providers: [FuncionariosService],
  controllers: [FuncionariosController],
  exports: [FuncionariosService],
})
export class FuncionariosModule {}
