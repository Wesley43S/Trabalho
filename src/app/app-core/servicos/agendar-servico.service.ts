import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class AgendarServicoService extends Dexie {
  servicos!: Table<any, number>;

  constructor() {
    super('AgendarServicoDB');
    this.version(1).stores({
      servicos: '++id, tipoServico, dataServico, horarioServico',
    });
  }

  async getServicos(): Promise<any[]> {
    return this.servicos.toArray();
  }
  async adicionarServico(servico: any): Promise<void> {
    const conflito = await this.verificarConflito(servico, null);
    if (conflito) {
      Swal.fire({
        icon: 'error',
        title: 'Conflito detectado',
        text: 'Já existe um serviço do mesmo tipo agendado para esta data e horário.',
      });
      return;
    }
    await this.servicos.add(servico);
    Swal.fire({
      icon: 'success',
      title: 'Serviço adicionado',
      text: 'O serviço foi agendado com sucesso!',
    });
  }

  async editarServico(id: number, servicoAtualizado: any): Promise<void> {
    const conflito = await this.verificarConflito(servicoAtualizado, id);
    if (conflito) {
      Swal.fire({
        icon: 'error',
        title: 'Conflito detectado',
        text: 'Já existe um serviço do mesmo tipo agendado para esta data e horário.',
      });
      return;
    }
    await this.servicos.update(id, servicoAtualizado);
    Swal.fire({
      icon: 'success',
      title: 'Serviço atualizado',
      text: 'O serviço foi atualizado com sucesso!',
    });
  }



  async removerServico(id: number): Promise<void> {
    await this.servicos.delete(id);
  }

  async verificarConflito(novoServico: any, indexIgnorado: number | null): Promise<boolean> {
    // Busca qualquer serviço com o mesmo horário e tipo de serviço
    const servicoExistente = await this.servicos
      .where({
        dataServico: novoServico.dataServico,
        horarioServico: novoServico.horarioServico,
        tipoServico: novoServico.tipoServico

      })
      .first();

    // Caso não existam serviços com o mesmo horário e tipo, não há conflito
    if (!servicoExistente) {
      return false;
    }

    // Se o serviço encontrado é diferente do índice sendo ignorado, é considerado um conflito
    if (indexIgnorado !== null && servicoExistente.id === indexIgnorado) {
      return false;
    }

    return true;
  }
  gerarHorariosDisponiveis(): string[] {
    const horariosManha = this.gerarIntervalos('08:00', '11:30');
    const horariosTarde = this.gerarIntervalos('13:00', '17:00');
    return [...horariosManha, ...horariosTarde];
  }

  private gerarIntervalos(inicio: string, fim: string): string[] {
    const horarios: string[] = [];
    const [horaInicio, minutoInicio] = inicio.split(':').map(Number);
    const [horaFim, minutoFim] = fim.split(':').map(Number);

    const inicioDate = new Date();
    inicioDate.setHours(horaInicio, minutoInicio, 0, 0);

    const fimDate = new Date();
    fimDate.setHours(horaFim, minutoFim, 0, 0);

    while (inicioDate <= fimDate) {
      const horaFormatada = inicioDate.getHours().toString().padStart(2, '0');
      const minutoFormatado = inicioDate.getMinutes().toString().padStart(2, '0');
      horarios.push(`${horaFormatada}:${minutoFormatado}`);


      inicioDate.setMinutes(inicioDate.getMinutes() + 30);
    }
    return horarios;
  }

}

