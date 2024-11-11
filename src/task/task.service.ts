import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(userId: number, createTaskDto: CreateTaskDto) {
    try {
      return await this.prisma.task.create({
        data: {
          ...createTaskDto,
          userId, // Only provide userId, Prisma will handle the relation
        },
      });
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  async getTasks(userId: number) {
    return this.prisma.task.findMany({
      where: {
        userId,
        isDeleted: false,
      },
    });
  }

  async getTaskById(userId: number, taskId: number) {
    return this.prisma.task.findFirst({
      where: {
        taskId,
        userId,
        isDeleted: false,
      },
    });
  }

  async updateTask(
    userId: number,
    taskId: number,
    updateTaskDto: UpdateTaskDto,
  ) {
    return this.prisma.task.updateMany({
      where: {
        taskId,
        userId,
      },
      data: updateTaskDto,
    });
  }

  async deleteTask(userId: number, taskId: number) {
    return this.prisma.task.updateMany({
      where: {
        taskId,
        userId,
      },
      data: { isDeleted: true },
    });
  }
}
