import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Prisma } from '@prisma/client';
import { isPrismaError } from 'src/utils/error';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(projectId: string, dto: CreateEventDto) {
    try {
      return await this.prisma.event.create({
        data: {
          ...dto,
          tags: dto.tags,
          project: { connect: { id: projectId } },
        },
      });
    } catch (e) {
      if (!isPrismaError(e)) throw e;
      if (e.code === 'P2025') throw new NotFoundException('Project not found');

      throw e;
    }
  }

  async findByProject(projectId: string) {
    return this.prisma.event.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, projectId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, projectId },
    });
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async update(id: string, projectId: string, dto: UpdateEventDto) {
    try {
      return await this.prisma.event.update({
        where: { id, projectId },
        data: { ...dto, tags: dto.tags as Prisma.InputJsonValue | undefined },
      });
    } catch (_e) {
      throw new NotFoundException('Event not found');
    }
  }

  async remove(id: string, projectId: string) {
    try {
      await this.prisma.event.delete({ where: { id, projectId } });
      return { deleted: true };
    } catch {
      throw new NotFoundException('Event not found');
    }
  }
}
