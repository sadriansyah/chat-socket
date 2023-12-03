import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const user = new this.userModel({
      username: username,
      salt: salt,
      password: await bcrypt.hash(password, salt),
    });

    return await user.save();
  }

  async findById(id: string): Promise<any> {
    return await this.userModel.findOne({ _id: id });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ username: username });
    if (
      user &&
      (await this.validatePassword(password, user.salt, user.password))
    ) {
      return user;
    }

    return null;
  }

  async validatePassword(
    password: string,
    salt: string,
    userPassword: string,
  ): Promise<boolean> {
    const hash = await bcrypt.hash(password, salt);
    return hash === userPassword;
  }
}
