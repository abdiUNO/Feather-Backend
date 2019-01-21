import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail(
    {},
    {
      message: 'Invalid e-mail address. Please try Again',
    },
  )
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  readonly fcmToken: string;
}
