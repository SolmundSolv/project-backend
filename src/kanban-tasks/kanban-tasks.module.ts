import { Module } from '@nestjs/common';
import { KanbanTasksService } from './kanban-tasks.service';
import { KanbanTasksController } from './kanban-tasks.controller';

@Module({
  controllers: [KanbanTasksController],
  providers: [KanbanTasksService]
})
export class KanbanTasksModule {}
