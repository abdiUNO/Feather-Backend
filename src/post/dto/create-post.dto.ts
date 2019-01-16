import { IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  readonly text: string;

  @IsNotEmpty()
  readonly category: string;

  readonly color: string;

  readonly image: string;
}
