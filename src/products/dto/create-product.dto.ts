import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  productName: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsString()
  @Matches(/^(?=.*[1-9])\d+(?:\.\d{1,2})?$/, {
    message: 'price must be a positive decimal with at most two decimal places',
  })
  price: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  categoryId?: number | null;
}
