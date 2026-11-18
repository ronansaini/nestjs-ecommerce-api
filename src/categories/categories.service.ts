import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isUniqueConstraintViolation } from '../database/is-unique-constraint-violation.js';
import { Category } from './category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.saveUniqueCategory(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Category ${id} was not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    if (Object.keys(updateCategoryDto).length === 0) {
      throw new BadRequestException('At least one field must be provided');
    }

    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    return this.saveUniqueCategory(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }

  private async saveUniqueCategory(category: Category): Promise<Category> {
    try {
      return await this.categoriesRepository.save(category);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException('A category with this name already exists');
      }
      throw error;
    }
  }
}
