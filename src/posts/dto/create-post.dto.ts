import { IsString, IsInt } from 'class-validator';

export class CreatePostDto {
  @IsString()
  readonly content: string;

  @IsInt()
  readonly voteDir: number;

  @IsInt()
  readonly likes: number;
}
