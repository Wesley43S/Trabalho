import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendarServicoService} from "../../app-core/servicos/agendar-servico.service";
import { StatusServico } from '../../app-core/model/status-servico';

@Component({
  selector: 'app-agendar-servicos',
  templateUrl: './agendar-servicos.component.html',
  styleUrls: ['./agendar-servicos.component.css']
})
export class AgendarServicosComponent implements OnInit {
  servicos: any[] = [];
  form: FormGroup;
  horariosDisponiveis: string[] = [];
  modalAberto: boolean = false;
  servicoEditandoIndex: number | null = null;
  statusList = StatusServico.getAllStatus();

  constructor(
    private fb: FormBuilder,
    private agendarServicoService: AgendarServicoService
  ) {
    this.form = this.fb.group({
      tipoServico: ['BANHO', Validators.required],
      dataServico: ['', Validators.required],
      horarioServico: ['', Validators.required],
      animal: ['CACHORRO', Validators.required],
      statusServico: ['NOVA', Validators.required],
    });
  }

  ngOnInit(): void {
    this.servicos = this.agendarServicoService.getServicos();
    this.horariosDisponiveis = this.agendarServicoService.gerarHorariosDisponiveis();
  }

  openModal(): void {
    this.modalAberto = true;
  }

  closeModal(): void {
    this.modalAberto = false;
    this.form.reset({
      tipoServico: 'BANHO',
      statusServico: 'NOVA',
      animal: 'CACHORRO'
    });
    this.servicoEditandoIndex = null; // Reseta índice de edição
  }

  salvarFormServico(): void {
    if (this.form.valid) {
      const novoServico = this.form.value;

      // Verifica conflito usando o serviço
      const conflito = this.agendarServicoService.verificarConflito(novoServico, this.servicoEditandoIndex);
      if (conflito) {
        alert('Erro: Já existe um serviço do mesmo tipo marcado para este horário.');
        return;
      }

      if (this.servicoEditandoIndex !== null) {
        // Edita serviço existente
        this.agendarServicoService.editarServico(this.servicoEditandoIndex, novoServico);
        this.servicoEditandoIndex = null;
      } else {
        // Adiciona novo serviço
        this.agendarServicoService.adicionarServico(novoServico);
      }

      this.servicos = this.agendarServicoService.getServicos(); // Atualiza a lista
      this.closeModal();
    } else {
      alert('Formulário inválido!');
    }
  }

  editarServico(index: number): void {
    const servico = this.servicos[index];
    this.form.patchValue(servico);
    this.servicoEditandoIndex = index; // Define índice em edição
    this.openModal();
  }

  removerServico(index: number): void {
    const confirmacao = confirm('Tem certeza que deseja remover este serviço?');
    if (confirmacao) {
      this.agendarServicoService.removerServico(index);
      this.servicos = this.agendarServicoService.getServicos();
    }
  }
}
