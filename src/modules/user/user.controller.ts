import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { User } from './user.entity';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto, UpdateUserDto } from './dto';

@Controller('users')
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get(':userId')
  // @Roles(RoleType.ADMIN)
  // @UseGuards(AuthGuard(), RoleGuard)
  getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
    return this._userService.get(userId);
  }

  @UseGuards(AuthGuard())
  @Get()
  getUsers(): Promise<ReadUserDto[]> {
    return this._userService.getAll();
  }

  // @Post()
  // async create(@Body() user: User): Promise<ReadUserDto> {
  //   const createdUser = await this._userService.create(user);
  //   return createdUser;
  // }

  @Patch(':userId')
  update(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() user: UpdateUserDto,
  ): Promise<ReadUserDto> {
    return this._userService.update(userId, user);
  }

  @Delete(':userId')
  async delete(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
    return this._userService.delete(userId);
  }

  @Post('setRole/:userId/:roleId')
  async setRoleToUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
  ): Promise<boolean> {
    return this._userService.setRoleToUser(userId, roleId);
  }
}
