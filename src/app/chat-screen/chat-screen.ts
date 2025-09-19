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
  async onChatClick(chatClicado: Ichat) {


    console.log("Chat Clicado", chatClicado);

    this.chatSelecionado = chatClicado;

    //Lógica para buscar as mensagens.

    let response = await firstValueFrom(this.http.get("https://senai-gpt-api.azurewebsites.net/messages?chatId=" + chatClicado.id, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    console.log("MENSAGENS", response);

    this.mensagens = response as IMessage[];

    this.cd.detectChanges();
  }

  async enviarMensagem() {

    let novaMensagemUsuario = {

      chatId: this.chatSelecionado.id,
      userId: localStorage.getItem("meuId"),
      text: this.mensagemUsuario.value

    };

    let novaMensagemUsuarioResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaMensagemUsuario, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));

    await this.onChatClick(this.chatSelecionado);

    // 2- enviar a mensagem do usuario para a IA responder

    let respostaIAResponse = await firstValueFrom(this.http.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent", {
      "contents": [
        {
          "parts": [
            {
              "text": this.mensagemUsuario.value + ".Me de uma resposta objetiva."
            }
          ]
        }
      ]
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": "AIzaSyDV2HECQZLpWJrqCKEbuq7TT5QPKKdLOdo"
      }

    })) as any;

    let novaRespostaIA = {

      chatId: this.chatSelecionado.id,
      userId: "chatbot",
      text: respostaIAResponse.candidates[0].content.parts[0].text
      //id
    }

    let novaRespostaIAResponse = await firstValueFrom(this.http.post("https://senai-gpt-api.azurewebsites.net/messages", novaRespostaIA, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }));
await this.onChatClick(this.chatSelecionado);
  }
}
