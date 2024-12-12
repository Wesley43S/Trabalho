export class StatusServico {
  static readonly AGENDADO = 'AGENDADO';
  static readonly EM_ANDAMENTO = 'EM ANDAMENTO';
  static readonly CONCLUIDA = 'CONCLUIDA';

  static getAllStatus() {
    return [StatusServico.AGENDADO, StatusServico.EM_ANDAMENTO, StatusServico.CONCLUIDA];
  }
}
