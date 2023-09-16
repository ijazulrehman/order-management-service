import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    required: true,
    description: 'The unique code or identifier of the product.',
  })
  @IsString()
  productCode: string;

  @ApiProperty({
    required: true,
    description: 'The name or title of the product.',
  })
  @IsString()
  productName: string;

  @ApiProperty({
    required: true,
    description: 'The price of the product in numeric format.',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    required: true,
    description: 'The quantity of the product in numeric format.',
  })
  @IsNumber()
  quantity: number;
}

export default CreateProductDto;
