import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
  HttpException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    const userId = req.user.id;
    return this.taskService.createTask(userId, createTaskDto);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user.id;
    const tasks = await this.taskService.getTasks(userId);
    if (!tasks) throw new HttpException('Tasks not found', 404);
    return tasks;
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.taskService.getTaskById(userId, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const userId = req.user.id;
    return this.taskService.updateTask(userId, +id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    const userId = req.user.id;
    return this.taskService.deleteTask(userId, +id);
  }
}
