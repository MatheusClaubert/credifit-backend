import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { EmpresasService } from './empresas.service';
import { CriarEmpresaDto } from './dto/criar-empresa.dto';
import type { Empresa } from './empresa.entity';

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly empresas: EmpresasService) {}

  @Post()
  criar(@Body() dto: CriarEmpresaDto): Empresa {
    return this.empresas.criar(dto);
  }

  @Get(':cnpj')
  obter(@Param('cnpj') cnpj: string): Empresa | undefined {
    return this.empresas.buscarPorCnpj(cnpj);
  }
}
