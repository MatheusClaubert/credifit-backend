import { IsString, Matches, IsNumber, Min } from 'class-validator';

export class CriarEmprestimoDto {
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos' })
  cpf: string;

  @IsNumber() @Min(100)
  valorSolicitado: number;
}
