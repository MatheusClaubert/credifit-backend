import { IsString, IsEmail, Matches, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CriarFuncionarioDto {
  @IsString() @IsNotEmpty()
  nomeCompleto: string;

  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf: string;

  @IsEmail()
  email: string;

  @IsString() @IsNotEmpty()
  senha: string;

  @IsNumber() @Min(1000)
  salario: number;

  // vínculo
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpjEmpresa: string;
}
