import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import ProductsService from './products.service';
import CreateProductDto from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import Product from './product.entity';

@ApiTags('products')
@Controller('products')
@ApiBearerAuth()
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOkResponse({
    type: [Product],
  })
  getAllProducts() {
    return this.productsService.getAllProducts();
  }

  @Get(':id')
  @ApiOkResponse({
    type: Product,
  })
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }

  @Post()
  @ApiOkResponse({
    type: Product,
  })
  async createProduct(@Body() product: CreateProductDto) {
    return this.productsService.createProduct(product);
  }

  @Put(':id')
  @ApiOkResponse({
    type: Product,
  })
  async replaceProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(Number(id), product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(Number(id));
  }
}
