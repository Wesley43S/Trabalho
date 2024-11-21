import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  form: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { email, senha } = this.form.value;
      // Aqui você pode implementar a lógica de autenticação
      console.log('Login:', { email, senha });
      this.errorMessage = ''; // Limpa mensagens de erro ao enviar
    } else {
      this.errorMessage = 'Por favor, preencha os campos corretamente.';
    }
  }
}



