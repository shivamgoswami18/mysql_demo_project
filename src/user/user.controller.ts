import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/libs/service/auth/jwt-auth.guard';
import { RolesGuard } from 'src/libs/service/auth/roles.guard';
import { ApiTag } from 'src/libs/utility/constants/enums';
import { Public } from 'src/libs/helpers/decorators/public.decorator';
import { RegistrationDto } from './dto/registration.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserPaginationDto } from './dto/userPagination.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

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
  async registration(@Body() dto: RegistrationDto) {
    return await this.userService.registration(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'View User Profile',
    description: 'Fetch user profile details by user ID.',
  })
  @Get('viewProfile')
  async viewProfile(@Request() req: any) {
    return await this.userService.viewProfile(req);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User Login',
    description: 'This API allows user to login using email and password.',
  })
  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return await this.userService.login(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update User Profile',
    description: 'Update user profile details by user ID.',
  })
  @Patch('updateProfile')
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return await this.userService.updateProfile(req, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete Service',
    description: 'This API allows to delete a service.',
  })
  @Patch('deleteUser/:id')
  async deleteUser(@Request() req: any) {
    return await this.userService.deleteUser(req);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'List of Users',
    description: 'This API allows to view all users with pagination.',
  })
  @Post('listOfUsers')
  async listOfUsers(@Body() dto: UserPaginationDto) {
    return await this.userService.listOfUsers(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change Password',
    description: 'Change your password',
  })
  @Post('changePassword')
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    return await this.userService.changePassword(req, dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify Email',
    description: 'This api will verify the email',
  })
  @Post('verifyEmail')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    return await this.userService.verifyEmail(dto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset Password',
    description: 'This api will reset password',
  })
  @Post('resetPassword')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.userService.resetPassword(dto);
  }
}
