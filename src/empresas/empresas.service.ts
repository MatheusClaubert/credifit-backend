import { Injectable, BadRequestException } from '@nestjs/common';
import { Empresa } from './empresa.entity';
import { CriarEmpresaDto } from './dto/criar-empresa.dto';

@Injectable()
export class EmpresasService {
  private empresas: Empresa[] = [];

  criar(dto: CriarEmpresaDto): Empresa {
    const existeCnpj = this.empresas.some(e => e.cnpj === dto.cnpj);
    const existeEmail = this.empresas.some(e => e.representanteEmail === dto.representanteEmail);
    const existeCpfRep = this.empresas.some(e => e.representanteCpf === dto.representanteCpf);
    if (existeCnpj) throw new BadRequestException('CNPJ já cadastrado');
    if (existeEmail) throw new BadRequestException('E-mail já cadastrado');
    if (existeCpfRep) throw new BadRequestException('CPF de representante já cadastrado');

    const empresa: Empresa = { ...dto };
    this.empresas.push(empresa);
    return empresa;
  }

  buscarPorCnpj(cnpj: string) {
    return this.empresas.find(e => e.cnpj === cnpj);
  }
}
