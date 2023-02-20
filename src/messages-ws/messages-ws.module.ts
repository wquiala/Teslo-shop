import { Module } from '@nestjs/common';
import { MessaggeWsGateway } from './messages-ws.gateway';
import { MessagesWsService } from './messages-ws.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [MessaggeWsGateway, MessagesWsService],
  imports: [AuthModule],
})
export class MessageWsModule {}
