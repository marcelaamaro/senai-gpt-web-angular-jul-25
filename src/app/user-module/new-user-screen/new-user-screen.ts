import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-user-screen',
  imports: [ReactiveFormsModule],
  templateUrl: './new-user-screen.html',
  styleUrl: './new-user-screen.css'
})
export class NewUserScreen {

  registerForm: FormGroup;

  emailErrorMessage: string;
  passwordErrorMessage: string;
  confirmpasswordErrorMessage: string;
  approvedMessage: string;
  usernameErrorMessage: string;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {
    //quando a tela iniciar.

    //inicia o formulario.
    //cria o campo obrigatorio de email.
    //cria o campo obrigatorio de senha.
    this.registerForm = this.fb.group({
      nome: ["", [Validators.required]],
      email: ["", [Validators.required]],
      password: ["", [Validators.required]]
    });

    this.emailErrorMessage="";
    this.passwordErrorMessage="";
    this.confirmpasswordErrorMessage="";
    this.approvedMessage="";
    this.usernameErrorMessage=""

  }

  async onloginClick() {

    console.log("nome", this.registerForm.value.nome);
    console.log("email", this.registerForm.value.email);
    console.log("Password", this.registerForm.value.password);

    if (this.registerForm.value.email == "") {
      this.emailErrorMessage = "Campo de email obrigatorio";
      return;
    }

if (this.registerForm.value.password == "") {
      this.passwordErrorMessage = "Campo obrigatorio";
      return;
    }

    if (this.registerForm.value.name == "") {
      this.usernameErrorMessage = "Campo obrigatorio";
      return;
    }




    let response = await fetch("https://senai-gpt-api.azurewebsites.net/login", {
      method: "POST", //enviar informacao
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        nome: this.registerForm.value.nome,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      })
    });

    console.log("STATUS CODE", response.status);

    if (response.status <= 299) {
      //Bloco positivo
      alert("Deu tudo certo");
    this.approvedMessage = "Login concluido com sucesso!"


let json = await response.json();

console.log("JSON", json);


let meuToken = json.acessToken;
let userId = json.user.id;


localStorage.setItem("meuToken",meuToken);
localStorage.setItem("meuId",userId);

window.location.href = "chat";

    } else {
      //Bloco do falso
      alert("deu errado");

      this.cd.detectChanges(); //Forcar uma atualizacao da tela.
    }
  }
}