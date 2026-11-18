import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError } from 'typeorm';
import { Category } from './category.entity.js';
import { CategoriesService } from './categories.service.js';

describe('CategoriesService', () => {
  const categoriesRepository = {
    create: vi.fn(),
    save: vi.fn(),
    find: vi.fn(),
    findOneBy: vi.fn(),
    remove: vi.fn(),
  };
  let categoriesService: CategoriesService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoriesRepository,
        },
      ],
    }).compile();

    categoriesService = module.get(CategoriesService);
  });

  it('returns not found when a category does not exist', async () => {
    categoriesRepository.findOneBy.mockResolvedValue(null);

    await expect(categoriesService.findOne(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('reports a duplicate category name as a conflict', async () => {
    categoriesRepository.create.mockReturnValue({ name: 'Accessories' });
    categoriesRepository.save.mockRejectedValue(
      new QueryFailedError('INSERT', [], { code: '23505' }),
    );

    await expect(
      categoriesService.create({ name: 'Accessories' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
