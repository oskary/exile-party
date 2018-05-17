import { Component, OnInit } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { AppConfig } from './../../../app.config';

@Component({
  selector: 'app-home-component',
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
  private _hubConnection: HubConnection | undefined;
  public async: any;
  message = '';
  messages: string[] = [];

  constructor() {
  }

  public sendMessage(): void {
    const data = `Sent: ${this.message}`;

    if (this._hubConnection) {
      this._hubConnection.invoke('Send', data);
    }
    this.messages.push(data);
  }

  ngOnInit() {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(AppConfig.apiUrl + 'hubs/main')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this._hubConnection.start().catch(err => console.error(err.toString()));

    this._hubConnection.on('Send', (data: any) => {
      const received = `Received: ${data}`;
      this.messages.push(received);
    });
  }
}