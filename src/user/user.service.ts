import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/model/user.schema';
import { HandleResponse } from 'src/libs/service/handleResponse';
import { ResponseData } from 'src/libs/utility/constants/response';
import { RegistrationDto } from './dto/registration.dto';
import { Messages } from 'src/libs/utility/constants/message';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { UserPaginationDto } from './dto/userPagination.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { VerifyEmailDto } from './dto/verifyEmail.dto';
import { Otp } from 'src/model/otp.schema';
import { mailSend } from 'src/libs/service/mail/mail';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Otp) private readonly otpModel: typeof Otp,
    private readonly jwtService: JwtService,
  ) {}

  async registration(dto: RegistrationDto) {
    const { email, password, ...userDetails } = dto;

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      Logger.error(`User ${Messages.ALREADY_EXIST}`);
      return HandleResponse(
        HttpStatus.CONFLICT,
        ResponseData.ERROR,
        `User ${Messages.ALREADY_EXIST}`,
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await this.userModel.create({
      email,
      password: hashPassword,
      ...userDetails,
    });

    Logger.log(`User ${Messages.CREATED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.CREATED,
      ResponseData.SUCCESS,
      `User ${Messages.CREATED_SUCCESSFULLY}`,
    );
  }

  async viewProfile(req: any) {
    const user = await this.userModel.findOne({
      where: { id: req.user.userId },
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`User ${Messages.FETCHED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `User ${Messages.FETCHED_SUCCESSFULLY}`,
      user,
    );
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.dataValues.password,
    );

    if (!isPasswordValid) {
      Logger.error(Messages.INVALID_CREDENTIALS);
      return HandleResponse(
        HttpStatus.UNAUTHORIZED,
        ResponseData.ERROR,
        Messages.INVALID_CREDENTIALS,
      );
    }

    const payload = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      role: user.dataValues.role,
    };

    const token = await this.jwtService.signAsync(payload);

    Logger.log(Messages.LOGIN_SUCCESSFULLY);

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      Messages.LOGIN_SUCCESSFULLY,
      token,
    );
  }

  async updateProfile(req: any, dto: UpdateProfileDto) {
    const user = await this.userModel.findOne({
      where: { id: req.user.userId },
    });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    await this.userModel.update(dto, {
      where: { id: req.user.userId },
    });

    Logger.log(`User ${Messages.UPDATED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.ACCEPTED,
      ResponseData.SUCCESS,
      `User ${Messages.UPDATED_SUCCESSFULLY}`,
    );
  }

  async deleteUser(req: any) {
    const user = await this.userModel.findOne({
      where: { id: req.user.userId },
    });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    if (user.dataValues.is_deleted === true) {
      return HandleResponse(
        HttpStatus.OK,
        ResponseData.SUCCESS,
        `User ${Messages.ALREADY_DELETED}`,
      );
    }

    await this.userModel.update(
      { is_deleted: true },
      { where: { id: req.user.userId } },
    );

    Logger.log(`User ${Messages.DELETED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `User ${Messages.DELETED_SUCCESSFULLY}`,
    );
  }

  async listOfUsers(dto: UserPaginationDto) {
    const {
      page = 1,
      limit = 10,
      sortKey = 'createdAt',
      sortOrder = 'desc',
      search,
    } = dto;

    const where: any = {
      is_deleted: false,
    };

    if (search) {
      const { Op } = require('sequelize');
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const order: any = [[sortKey, sortOrder.toUpperCase()]];

    const offset = (page - 1) * limit;
    const { rows: users, count: totalCount } =
      await this.userModel.findAndCountAll({
        where,
        order,
        limit,
        offset,
        attributes: [
          'id',
          'name',
          'email',
          'phone',
          'age',
          'role',
          'createdAt',
          'updatedAt',
        ],
      });

    if (users.length === 0) {
      Logger.error(`Users ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `Users ${Messages.NOT_FOUND}`,
      );
    }

    Logger.log(`Users ${Messages.FETCHED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Users ${Messages.FETCHED_SUCCESSFULLY}`,
      {
        users,
        totalCount,
        itemsCount: users.length,
        currentPage: page ? Number(page) : null,
        totalPage: Math.ceil(totalCount / Number(limit)),
        pageSize: limit ? Number(limit) : 1,
      },
    );
  }

  async changePassword(req: any, dto: ChangePasswordDto) {
    const { old_password, new_password } = dto;
    const user = await this.userModel.findOne(req.user.userId);

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    const isMatch = await bcrypt.compare(
      old_password,
      user.dataValues.password,
    );
    if (!isMatch) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `Old password ${Messages.INCORRECT}`,
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await this.userModel.update(
      { password: hashedPassword },
      { where: { id: req.user.userId } },
    );

    Logger.log(`Password ${Messages.CHANGED_SUCCESSFULLY}`);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Password ${Messages.CHANGED_SUCCESSFULLY}`,
    );
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const { email } = dto;
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    const existingOtp = await this.otpModel.findOne({ where: { email } });

    if (existingOtp) {
      await this.otpModel.update(
        { otp, otp_expire: expireTime },
        { where: { email } },
      );
    } else {
      await this.otpModel.create({
        email,
        otp,
        otp_expire: expireTime,
      });
    }

    const emailSubject = 'Reset Password OTP';
    const emailText = `Your OTP is ${otp}. It is valid for 10 minutes.`;

    await mailSend({
      to: email,
      subject: emailSubject,
      text: emailText,
    });

    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      `Otp ${Messages.SEND_SUCCESSFULLY}`,
    );
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { email, otp, new_password } = dto;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user) {
      Logger.error(`User ${Messages.NOT_FOUND}`);
      return HandleResponse(
        HttpStatus.NOT_FOUND,
        ResponseData.ERROR,
        `User ${Messages.NOT_FOUND}`,
      );
    }

    const otpRecord = await this.otpModel.findOne({ where: { email } });
    if (!otpRecord || Number(otpRecord.dataValues.otp) !== Number(otp)) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `OTP ${Messages.INVALID}`,
      );
    }

    if (otpRecord.dataValues.otp_expire < new Date()) {
      return HandleResponse(
        HttpStatus.BAD_REQUEST,
        ResponseData.ERROR,
        `OTP ${Messages.EXPIRED}`,
      );
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await this.userModel.update(
      { password: hashedPassword },
      { where: { email } },
    );

    await this.otpModel.destroy({ where: { email } });

    Logger.log(Messages.PASSWORD_RESET_SUCCESSFULLY);
    return HandleResponse(
      HttpStatus.OK,
      ResponseData.SUCCESS,
      Messages.PASSWORD_RESET_SUCCESSFULLY,
    );
  }
}
