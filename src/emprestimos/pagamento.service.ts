// src/emprestimos/pagamento.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagamentoService {
  processarPagamento(valor: number) {
    return {
      status: 'SUCESSO' as const,
      transacaoId: `TX-${Date.now()}`,
      valor,
    };
  }
}
