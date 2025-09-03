// src/emprestimos/emprestimo.entity.ts
export interface Parcela {
  numero: number;
  valor: number;
  vencimento: string; // YYYY-MM-DD
}

export interface OpcaoParcelamento {
  vezes: number;
  parcelas: Parcela[];
}

export interface Pagamento {
  status: 'SUCESSO' | 'FALHA';
  transacaoId: string;
  valor: number;
}

export interface Emprestimo {
  id: number;
  createdAt: string;
  nome: string;
  cpf: string;
  salario: number;
  valorSolicitado: number;
  score: number;
  aprovado: boolean;
  motivoRejeicao?: string;
  pagamento?: Pagamento;
  opcoesParcelamento?: OpcaoParcelamento[];
}
