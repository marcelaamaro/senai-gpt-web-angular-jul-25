import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'
})
export class NewUserScreen {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    //quando a tela iniciar.

    //inicia o formulario.
    //cria o campo obrigatorio de email.
    //cria o campo obrigatorio de senha.
    this.loginForm = this.fb.group({
      nome: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });


  }

  async onloginClick() {
    alert("botao de login clicado.");

    console.log("nome", this.loginForm.value.nome);
    console.log("email", this.loginForm.value.email);
    console.log("Password", this.loginForm.value.password);

    if (this.loginForm.value.email == "") {
      alert("Preencha o e-mail.");
      return;
    }

    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST", //enviar informacao
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        nome: this.loginForm.value.nome,
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      })
    });
    console.log("STATUS CODE", response.status);


    if (response.status <= 299) {
      //Bloco positivo
      alert("Deu tudo certo");
let json = await response.json();
console.log("JSON", json);
let meuToken = json.accessToken;
let userId = json.user.id;

localStorage.setItem("meuToken", meuToken);
localStorage.setItem("meuId", userId);

window.location.href = "chat";
    } else {
      //Bloco do falso
      alert("deu errado");

      this.cd.detectChanges(); //Forcar uma atualizacao da tela.
    }
  }
}