import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class MovePageDto {
  @IsString()
  pageId: string;

  @IsString()
  @MinLength(5)
  @MaxLength(12)
  position: string;

  @IsOptional()
  @IsString()
  parentPageId?: string | null;
}

export class MovePageToAnotherSpaceDto {
  @IsString()
  pageId: string;

  @IsString()
  spaceId: string;
}
