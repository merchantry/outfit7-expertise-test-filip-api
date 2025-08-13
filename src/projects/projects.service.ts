import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { isPrismaError } from 'src/utils/error';

function newApiKey() {
  return Math.random().toString(36).substring(2, 15);
}

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProjectDto) {
    try {
      return await this.prisma.project.create({
        data: { ...dto, apiKey: newApiKey() },
      });
    } catch (e) {
      if (!isPrismaError(e)) throw e;
      if (e.code === 'P2002')
        throw new ConflictException('Project name already exists');
      throw e;
    }
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const project = await this.prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async findOneByApiKey(apiKey: string) {
    const project = await this.prisma.project.findUnique({ where: { apiKey } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({ where: { id }, data: dto });
    } catch (e) {
      if (!isPrismaError(e)) throw e;
      if (e.code === 'P2025') throw new NotFoundException('Project not found');
      if (e.code === 'P2002')
        throw new ConflictException('Project name already exists');
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.project.delete({ where: { id } });
      return { deleted: true };
    } catch (e) {
      if (!isPrismaError(e)) throw e;
      if (e.code === 'P2025') throw new NotFoundException('Project not found');
      throw e;
    }
  }
}
