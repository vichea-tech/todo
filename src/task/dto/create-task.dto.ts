import { Status, Priority } from '@prisma/client';

export class CreateTaskDto {
  task: string;
  description?: string;
  status?: Status; // Enum reference for status
  dueDate?: Date;
  priority?: Priority; // Enum reference for priority
  category?: string;
  reminderAt?: Date;
}
