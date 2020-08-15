import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';

import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly _userRepository: UserRepository,
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(userId: number): Promise<ReadUserDto> {
    if (!userId) {
      throw new BadRequestException('Id must be sent.');
    }

    const user: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return plainToClass(ReadUserDto, user);
  }

  async getAll(): Promise<ReadUserDto[]> {
    const users: User[] = await this._userRepository.find({
      where: { status: status.ACTIVE },
    });

    if (!users) {
      throw new NotFoundException();
    }

    return users.map(user => plainToClass(ReadUserDto, user));
  }

  // async create(user: User): Promise<User> {
  //   const details = new UserDetails();
  //   user.details = details;

  //   const repo = await getConnection().getRepository(Role);
  //   const defaultRole = await repo.findOne({ where: { name: 'GENERAL' } });
  //   user.roles = [defaultRole];

  //   const savedUser: User = await this._userRepository.save(user);
  //   return savedUser;
  // }

  async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
    const userExists: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExists) {
      throw new NotFoundException('User does not exists.');
    }

    userExists.username = user.username;

    const updatedUser: User = await this._userRepository.save(userExists);

    return plainToClass(ReadUserDto, updatedUser);
  }

  async delete(userId: number): Promise<void> {
    const userExists: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExists) {
      throw new NotFoundException();
    }

    await this._userRepository.update(userId, { status: status.INACTIVE });
  }

  async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
    const userExists: User = await this._userRepository.findOne(userId, {
      where: { status: status.ACTIVE },
    });
    if (!userExists) {
      throw new NotFoundException();
    }

    const roleExists: Role = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });
    if (!roleExists) {
      throw new NotFoundException('Role does not exists');
    }

    userExists.roles.push(roleExists);

    await this._userRepository.save(userExists);

    return true;
  }
}
