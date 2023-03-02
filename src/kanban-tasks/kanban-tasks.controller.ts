import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { KanbanTasksService } from './kanban-tasks.service';
import { CreateKanbanTaskDto } from './dto/create-kanban-task.dto';
import { UpdateKanbanTaskDto } from './dto/update-kanban-task.dto';

@Controller('kanban')
export class KanbanTasksController {
  constructor(private readonly kanbanTasksService: KanbanTasksService) {}

  @Post()
  createBoard(@Body('title') title: string) {
    return this.kanbanTasksService.createBoard(title);
  }

  @Post(':boardId')
  createColumn(
    @Param('boardId') boardId: string,
    @Body('title') title: string,
  ) {
    return this.kanbanTasksService.createColumn(boardId, title);
  }

  @Post('comments/:taskId')
  createCommentInTask(
    @Param('taskId') taskId: string,
    @Body('label') label: string,
    @Body('content') content: string,
    @Body('employeeId') employeeId: string,
  ) {
    return this.kanbanTasksService.createCommentInTask(
      label,
      content,
      taskId,
      employeeId,
    );
  }

  @Post(':boardId/:columnId')
  createTask(
    @Param('columnId') columnId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('tasks') tasks: { title: string; description: string }[],
  ) {
    return this.kanbanTasksService.createTask(
      columnId,
      title,
      description,
      tasks,
    );
  }

  @Get(':boardId')
  findAll(@Param('boardId') boardId: string) {
    return this.kanbanTasksService.findAllBoard(boardId);
  }

  @Get('task/:taskId')
  findOne(@Param('taskId') taskId: string) {
    return this.kanbanTasksService.findTaskDetails(taskId);
  }

  @Get('comments/:taskId')
  findComments(@Param('taskId') taskId: string) {
    return this.kanbanTasksService.findAllCommentsInTask(taskId);
  }

  @Patch('checklist/:id')
  updateChecklistItem(
    @Param('id') id: string,
    @Body('checked') checked: boolean,
  ) {
    return this.kanbanTasksService.updateChecklistItem(id, checked);
  }
  @Post(':taskId/add/:userId')
  addEmployeeToTask(
    @Param('taskId') taskId: string,
    @Param('userId') userId: string,
  ) {
    return this.kanbanTasksService.addEmployeeToTask(userId, taskId);
  }
}
