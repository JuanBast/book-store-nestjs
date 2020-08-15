import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { status } from '../../shared/entity-status.enum';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dtos';
import { plainToClass } from 'class-transformer';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async get(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('Id must be sent.');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: status.ACTIVE },
    });

    if (!roles) {
      throw new NotFoundException();
    }

    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
    const savedRole: Role = await this._roleRepository.save(role);
    return plainToClass(ReadRoleDto, savedRole);
  }

  async update(
    roleId: number,
    role: Partial<UpdateRoleDto>,
  ): Promise<ReadRoleDto> {
    const roleExists: Role = await this._roleRepository.findOne(roleId, {
      where: { status: status.ACTIVE },
    });
    if (!roleExists) {
      throw new NotFoundException('This role does not exists');
    }

    roleExists.name = role.name ? role.name : roleExists.name;
    roleExists.description = role.description
      ? role.description
      : roleExists.description;

    const updatedRole: Role = await this._roleRepository.save(roleExists);

    return plainToClass(ReadRoleDto, updatedRole);
  }

  async delete(id: number): Promise<void> {
    const roleExists: Role = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
