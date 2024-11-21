export class StatusServico {
  static readonly NOVA = 'NOVA';
  static readonly EM_ANDAMENTO = 'EM ANDAMENTO';
  static readonly CONCLUIDA = 'CONCLUIDA';

  static getAllStatus() {
    return [StatusServico.NOVA, StatusServico.EM_ANDAMENTO, StatusServico.CONCLUIDA];
  }
}
