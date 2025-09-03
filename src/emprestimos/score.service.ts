// src/emprestimos/score.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ScoreService {
  obterScore(cpf: string): number {
    const last = cpf[cpf.length - 1];
    if (last === '0') return 320; // baixo
    if (last === '5') return 720; // alto
    return 600; // médio
  }
}
