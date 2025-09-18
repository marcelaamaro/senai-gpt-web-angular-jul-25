import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface Ichat {

  chatTitle: string;
  id: number;
  userId: string;
}

interface IMessage {

  chatId: number;
  id: number;
  text: string;
  userId: string;

}

@Component({
  selector: 'app-chat-screen',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen {

  chats: Ichat[];
  chatSelecionado: Ichat;
  mensagens: IMessage[];
  mensagemUsuario = new FormControl("");

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { // Constroi a classe
    // inicializacao de variaveis...
    this.chats = [];
    this.chatSelecionado = null!;
    this.mensagens = [];
  }

  ngOnInit() {  //executado quando o angular esta pronto para rodar
    // buscar dados da API.
    this.getChats();

  }


  async getChats() {
    // metodo que busca os chats da API.
    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {

      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    console.log("Chats", response);

    if (response) {
      this.chats = response as [];

    } else {

      console.log("Erro ao buscar os chats.");

    }
    this.cd.detectChanges();
  }
    async onChatClick (chatClicado: Ichat) {

    console.log("Chat Clicado", chatClicado);

    this.chatSelecionado = chatClicado;

    //Lógica para buscar as mensagens.

      let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
        headers: {
          "Authorization" : "Bearer " + localStorage.getItem("meuToken")
        } 
    }));

    console.log("MENSAGENS", response);

    this.mensagens = response as IMessage[];

    this.cd.detectChanges ();
  }

  async enviarMensagem (){
    let novaMensagemUsuario = {
chatId: this.chatSelecionado.id,
userId: localStorage.getItem("meuId"),
Text: this.mensagemUsuario.value

    }
  }
}
