import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';

import { ProjectsService } from './projects.service';
import { PrismaService } from 'src/prisma/prisma.service';

const mockPrisma = {
  project: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneByApiKey: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ProjectsService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get(ProjectsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return result', async () => {
      const dto = { name: 'Test', updateIntervalSeconds: 10 };
      service.create.mockResolvedValue('created');
      await expect(controller.create(dto)).resolves.toBe('created');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return result', async () => {
      service.findAll.mockResolvedValue(['project']);
      await expect(controller.findAll()).resolves.toEqual(['project']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call service.findOne and return result', async () => {
      service.findOne.mockResolvedValue('project');
      await expect(controller.findOne('id')).resolves.toBe('project');
      expect(service.findOne).toHaveBeenCalledWith('id');
    });
  });

  describe('findOneByApiKey', () => {
    it('should call service.findOneByApiKey and return result', async () => {
      service.findOneByApiKey.mockResolvedValue('project');
      await expect(controller.findOneByApiKey('api-key')).resolves.toBe(
        'project',
      );
      expect(service.findOneByApiKey).toHaveBeenCalledWith('api-key');
    });
  });

  describe('update', () => {
    it('should call service.update and return result', async () => {
      const dto = { name: 'Updated' };
      service.update.mockResolvedValue('updated');
      await expect(controller.update('id', dto)).resolves.toBe('updated');
      expect(service.update).toHaveBeenCalledWith('id', dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove and return result', async () => {
      service.remove.mockResolvedValue({ deleted: true });
      await expect(controller.remove('id')).resolves.toEqual({ deleted: true });
      expect(service.remove).toHaveBeenCalledWith('id');
    });
  });
});
