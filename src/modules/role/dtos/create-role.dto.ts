import { IsString, MaxLength } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MaxLength(50, { message: 'This name is too long' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'The description is too long' })
  readonly description: string;
}
