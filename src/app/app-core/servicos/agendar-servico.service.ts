import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgendarServicoService {

  private servicos: any[] = [];

  getServicos(): any[] {
    return this.servicos;
  }

  adicionarServico(servico: any): void {
    this.servicos.push(servico);
  }

  editarServico(index: number, servicoAtualizado: any): void {
    this.servicos[index] = servicoAtualizado;
  }

  removerServico(index: number): void {
    this.servicos.splice(index, 1);
  }

  verificarConflito(novoServico: any, indexIgnorado: number | null): boolean {
    return this.servicos.some((servico, index) =>
      servico.horarioServico === novoServico.horarioServico &&
      servico.tipoServico === novoServico.tipoServico &&
      index !== indexIgnorado
    );
  }

  gerarHorariosDisponiveis(): string[] {
    const horariosManha = this.gerarIntervalos('08:00', '12:00');
    const horariosTarde = this.gerarIntervalos('13:30', '17:30');
    return [...horariosManha, ...horariosTarde];
  }

  private gerarIntervalos(inicio: string, fim: string): string[] {
    const horarios: string[] = [];
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFim, minutoFim] = fim.split(':').map(Number);

    let horaAtual = horaInicio;
    let minutoAtual = minutoInicio;

    while (horaAtual < horaFim || (horaAtual === horaFim && minutoAtual < minutoFim)) {
      const horaFormatada = horaAtual.toString().padStart(2, '0');
      const minutoFormatado = minutoAtual.toString().padStart(2, '0');
      horarios.push(`${horaFormatada}:${minutoFormatado}`);

      // Incrementa 30 minutos
      minutoAtual += 30;
      if (minutoAtual >= 60) {
        minutoAtual = 0;
        horaAtual += 1;
      }
    }

    return horarios;
  }
}
