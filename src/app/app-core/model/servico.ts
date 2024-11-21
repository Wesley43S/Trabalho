export class Servico {
  tipoServico: 'BANHO' | 'TOSA';
  dataServico: Date;
  horarioServico: string;
  animal: 'CACHORRO' | 'GATO';
  statusServico: 'NOVA' | 'EM_ANDAMENTO' | 'CONCLUIDA';


  constructor(
    tipoServico: 'BANHO' | 'TOSA',
    dataServico: Date,
    horarioServico: string,
    animal: 'CACHORRO' | 'GATO',
    statusServico: 'NOVA' | 'EM_ANDAMENTO' | 'CONCLUIDA',
  ) {
    this.tipoServico = tipoServico;
    this.dataServico = dataServico;
    this.horarioServico = horarioServico;
    this.animal = animal;
    this.statusServico = statusServico;
  }
}


