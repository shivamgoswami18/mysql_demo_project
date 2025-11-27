import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/service/auth/jwt-auth.guard';
import { RolesGuard } from 'src/libs/service/auth/roles.guard';
import { ApiTag } from 'src/libs/utility/constants/enums';
import { Public } from 'src/libs/helpers/decorators/public.decorator';
import { RegistrationDto } from './dto/registration.dto';

@ApiTags(ApiTag.USER)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'User Registration',
    description: 'This API allows a new user to register.',
  })
  @Post('registration')
  @Public()
  registration(@Body() dto: RegistrationDto) {
    return this.userService.registration(dto);
  }
}
