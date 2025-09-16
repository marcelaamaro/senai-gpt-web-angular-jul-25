import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Ichat {

  chatTitle: string;
  id: number;
  userId: string;
}

@Component({
  selector: 'app-chat-screen',
  imports: [HttpClientModule, CommonModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen {

  chats: Ichat[];

  constructor(private http: HttpClient) { // Constroi a classe
    // inicializacao de variaveis...
    this.chats = [];
  }

  ngOnInit() {  //executado quando o angular esta pronto para rodar
    // buscar dados da API.
    this.getChats();

  }


  async getChats() {
    // metodo que busca os chats da API.
    let response = await this.http.get("https://senai-gpt-api.azurewebsites.net/chats", {

      headers: {
        "Authorization": "Bearer " + localStorage.getItem("meuToken")
      }
    }).toPromise();

    console.log("Chats", response);

    if (response) {
      this.chats = response as [];

    } else {

      console.log("Erro ao buscar os chats.");

    }
  }
}
