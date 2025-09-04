import { IsString, IsEmail, Matches, IsNotEmpty } from 'class-validator';

export class CriarEmpresaDto {
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @IsString() @IsNotEmpty()
  razaoSocial: string;

  // Representante
  @IsString() @IsNotEmpty()
  representanteNome: string;

  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  representanteCpf: string;

  @IsEmail()
  representanteEmail: string;

  @IsString() @IsNotEmpty()
  representanteSenha: string;
}
