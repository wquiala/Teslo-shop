import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorators';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { SeedService } from './seed.service';
import { User } from '../auth/entities/user.entity';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @Auth()
  executeSeed(@GetUser() user: User) {
    return this.seedService.runSeed(user);
  }
}
