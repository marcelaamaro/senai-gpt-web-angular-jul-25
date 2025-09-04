import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css'
})
export class LoginScreen {
 loginForm: FormGroup;

    constructor(private fb: FormBuilder) {
      //quando a tela iniciar.

      //inicia o formulario.
      //cria o campo obrigatorio de email.
      //cria o campo obrigatorio de senha.
      this.loginForm = this.fb.group({
        email: ["", [Validators.required]],
        password: ["", [Validators.required]]   });


    }

    onloginClick() {
      alert("botao de login clicado.");

      console.log("email", this.loginForm.value.email);
      console.log("Password", this.loginForm.value.password);
    }
  }