import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessaggeDto } from './dtos/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessaggeWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messaggeWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      const payload = this.jwtService.verify(token);
      await this.messaggeWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    console.log({ payload });

    //console.log({ conectados: this.messaggeWsService.getConnectedClient() });
    this.wss.emit(
      'clients-updated',
      this.messaggeWsService.getConnectedClient(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messaggeWsService.removeClient(client.id);

    this.wss.emit(
      'clients-updated',
      this.messaggeWsService.getConnectedClient(),
    );
    //console.log({ conectados: this.messaggeWsService.getConnectedClient() });
  }

  @SubscribeMessage('messagge-from-client')
  handleMessaggeFromClient(client: Socket, payload: NewMessaggeDto) {
    this.wss.emit('message-from-server', {
      fullName: this.messaggeWsService.getUserFullName(client.id),
      message: payload.messagge || 'no-message',
    });
  }
}
