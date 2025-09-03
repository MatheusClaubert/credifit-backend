import { IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";

export class CriarEmprestimoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Matches(/^\d{11}$/, { message: 'cpf deve conter 11 dígitos numéricos' })
  cpf: string;

  @IsNumber()
  @Min(1000)
  salario: number;

  @IsNumber()
  @Min(100)
  valorSolicitado: number;
}
