import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/model/user.model';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utility/constants/response';
import { RegistrationDto } from './dto/registration.dto';
import { Messages } from 'src/libs/utility/constants/message';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async registration(dto: RegistrationDto) {
    const { name } = dto;

    const existingUser = await this.userModel.findOne({ where: { name } });
    if (existingUser) {
      Logger.error(`User ${Messages.ALREADY_EXIST}`);
      return HandleResponse(
        HttpStatus.CONFLICT,
        ResponseData.ERROR,
        `User ${Messages.ALREADY_EXIST}`,
      );
    }

    await this.userModel.create({ name });

    Logger.log(`User ${Messages.CREATED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      `User ${Messages.CREATED_SUCCESSFULLY}`,
    );
  }
}
