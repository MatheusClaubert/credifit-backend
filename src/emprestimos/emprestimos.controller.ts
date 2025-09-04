import { CriarEmprestimoDto } from "./dto/criar-emprestimo.dto";
import { Emprestimo } from "./emprestimos.entity";
import { EmprestimosService } from "./emprestimos.service";


@Controller('emprestimos')
export class EmprestimosController {
  constructor(private readonly emprestimos: EmprestimosService) {}

  @Post()
  async solicitar(@Body() dto: CriarEmprestimoDto): Promise<Emprestimo> {
    return this.emprestimos.solicitar(dto);
  }

  @Get()
  listar(): Emprestimo[] {
    return this.emprestimos.listar();
  }
}
