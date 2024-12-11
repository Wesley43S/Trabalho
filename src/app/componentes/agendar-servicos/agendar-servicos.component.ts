import { Component, OnInit } from '@angular/core';
import {AgendarServicoService} from "../../app-core/servicos/agendar-servico.service";
import {Servico} from "../../app-core/model/servico";
import Swal from 'sweetalert2';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-agendar-servicos',
  templateUrl: './agendar-servicos.component.html',
  styleUrls: ['./agendar-servicos.component.css']
})

export class AgendarServicosComponent implements OnInit {
  servicos: any[] = [];
  horariosDisponiveis: string[] = [];
  statusList = ['AGENDADO', 'EM ANDAMENTO', 'FINALIZADO'];

  form!: FormGroup;
  modalAberto: boolean = false;
  servicoEditandoIndex: number | null = null;

  constructor(
    private agendarServicoService: AgendarServicoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
    this.horariosDisponiveis = this.agendarServicoService.gerarHorariosDisponiveis();
    this.form = this.fb.group({
      tipoServico: ['', Validators.required],
      dataServico: ['', Validators.required],
      horarioServico: ['', Validators.required],
      animal: ['', Validators.required],
      statusServico: ['AGENDADO', Validators.required]
    });
  }

  async carregarServicos(): Promise<void> {
    try {
      this.servicos = await this.agendarServicoService.getServicos();
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  }

  openModal(index: number | null = null): void {
    this.servicoEditandoIndex = index;

    if (index !== null) {
      // Carregar dados do serviço selecionado no formulário
      const servico = this.servicos[index];
      this.form.patchValue(servico);
    } else {
      // Resetar o formulário para novo serviço
      this.form.reset({
        tipoServico: '',
        dataServico: '',
        horarioServico: '',
        animal: '',
        statusServico: 'AGENDADO'
      });
    }

    this.modalAberto = true;
  }

  closeModal(): void {
    this.modalAberto = false;
    this.servicoEditandoIndex = null;
  }
  editarServico(index: number): void {
    this.openModal(index);
  }
  async salvarFormServico(): Promise<void> {
    if (this.form.invalid) return;

    const servico = this.form.value;

    try {
      if (this.servicoEditandoIndex !== null) {
        const id = this.servicos[this.servicoEditandoIndex].id;
        await this.agendarServicoService.editarServico(id, servico);
      } else {
        await this.agendarServicoService.adicionarServico(servico);
      }

      this.carregarServicos();
      this.closeModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  }

  async removerServico(index: number): Promise<void> {
    const id = this.servicos[index].id;

    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Você realmente deseja remover este serviço?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, remover',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await this.agendarServicoService.removerServico(id);
        await this.carregarServicos();
        Swal.fire('Removido!', 'O serviço foi removido com sucesso.', 'success');
      } catch (error) {
        console.error('Erro ao remover serviço:', error);
        Swal.fire('Erro', 'Ocorreu um erro ao tentar remover o serviço.', 'error');
      }
    }
  }
}


