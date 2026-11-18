import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/category.entity.js';
import { Product } from './product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create({
      productName: createProductDto.productName,
      description: createProductDto.description ?? null,
      price: createProductDto.price,
      category: await this.findCategory(createProductDto.categoryId),
    });
    return this.productsRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: { category: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product ${id} was not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    const product = await this.findOne(id);
    if (updateProductDto.productName !== undefined) {
      product.productName = updateProductDto.productName;
    }
    if (updateProductDto.description !== undefined) {
      product.description = updateProductDto.description;
    }
    if (updateProductDto.price !== undefined) {
      product.price = updateProductDto.price;
    }
    if (updateProductDto.categoryId !== undefined) {
      product.category = await this.findCategory(updateProductDto.categoryId);
    }

    return this.productsRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }

  private async findCategory(
    categoryId: number | null | undefined,
  ): Promise<Category | null> {
    if (categoryId === undefined || categoryId === null) {
      return null;
    }

    const category = await this.categoriesRepository.findOneBy({
      id: categoryId,
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} was not found`);
    }
    return category;
  }
}
