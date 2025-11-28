import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/model/user.schema';
import { Otp } from 'src/model/otp.schema';

@Module({
  imports: [SequelizeModule.forFeature([User, Otp])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
