import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../categories/category.entity.js';
import { Product } from './product.entity.js';
import { ProductsService } from './products.service.js';

describe('ProductsService', () => {
  const productsRepository = {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    remove: vi.fn(),
  };
  const categoriesRepository = {
    findOneBy: vi.fn(),
  };
  let productsService: ProductsService;

  beforeEach(async () => {
    vi.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productsRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoriesRepository,
        },
      ],
    }).compile();

    productsService = module.get(ProductsService);
  });

  it('rejects a product that references a missing category', async () => {
    categoriesRepository.findOneBy.mockResolvedValue(null);

    await expect(
      productsService.create({
        productName: 'Desk Lamp',
        price: '39.95',
        categoryId: 99,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(productsRepository.save).not.toHaveBeenCalled();
  });

  it('allows a product to be unassigned from its category', async () => {
    const product = {
      id: 1,
      productName: 'Desk Lamp',
      description: null,
      price: '39.95',
      category: null,
    };
    productsRepository.findOne.mockResolvedValue({
      ...product,
      category: { id: 2, name: 'Lighting' },
    });
    productsRepository.save.mockImplementation(async (savedProduct) => ({
      ...savedProduct,
    }));

    const result = await productsService.update(1, { categoryId: null });

    expect(result.category).toBeNull();
    expect(productsRepository.save).toHaveBeenCalledOnce();
  });
});
