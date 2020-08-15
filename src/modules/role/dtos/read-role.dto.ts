import { IsString, MaxLength, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadRoleDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(50, { message: 'This name is too long' })
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(100, { message: 'The description is too long' })
  readonly description: string;
}
