import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateKanbanTaskDto } from './dto/create-kanban-task.dto';
import { UpdateKanbanTaskDto } from './dto/update-kanban-task.dto';

@Injectable()
export class KanbanTasksService {
  constructor(private prisma: PrismaService) {}

  async createBoard(title: string) {
    return await this.prisma.kanban.create({
      data: {
        name: title,
      },
    });
  }

  async createColumn(boardId: string, title: string) {
    return await this.prisma.kanbanColumn.create({
      data: {
        name: title,
        kanban: {
          connect: {
            id: boardId,
          },
        },
      },
    });
  }

  async createTask(
    columnId: string,
    title: string,
    description: string,
    tasks: { title: string; description: string }[],
  ) {
    return await this.prisma.kanbanTask.create({
      data: {
        name: title,
        column: {
          connect: {
            id: columnId,
          },
        },
        KanbanTaskLabel: {
          create: {
            name: title,
          },
        },
        KanbanTaskAttachment: {
          create: {
            name: description,
          },
        },
        KanbanTaskChecklist: {
          create: {
            name: 'tasks',
            KanbanTaskChecklistItem: {
              create: tasks.map((task) => ({
                name: task.title,
                KanbanTaskChecklistItemLabel: {
                  create: {
                    name: task.title,
                  },
                },
                KanbanTaskChecklistItemAttachment: {
                  create: {
                    name: task.description,
                  },
                },
              })),
            },
          },
        },
        KanbanTaskAttachmentLabel: {
          create: {
            name: title,
          },
        },
      },
    });
  }

  async addTaskToColumn(columnId: string, taskId: string) {
    return await this.prisma.kanbanColumn.update({
      where: {
        id: columnId,
      },
      data: {
        tasks: {
          connect: {
            id: taskId,
          },
        },
      },
    });
  }

  async addCommentToTask(
    taskId: string,
    comment: { label: string; description: string },
  ) {
    return await this.prisma.kanbanTask.update({
      where: {
        id: taskId,
      },
      data: {
        KanbanTaskComment: {
          create: {
            name: comment.label,
            KanbanTaskCommentLabel: {
              create: {
                name: comment.label,
              },
            },
            KanbanTaskCommentAttachment: {
              create: {
                name: comment.description,
              },
            },
          },
        },
      },
    });
  }

  async addCommentToChechlistItem(
    taskId: string,
    comment: { label: string; description: string },
  ) {
    return await this.prisma.kanbanTaskChecklistItem.update({
      where: {
        id: taskId,
      },
      data: {
        KanbanTaskChecklistItemLabel: {
          create: {
            name: comment.label,
          },
        },
        KanbanTaskChecklistItemAttachment: {
          create: {
            name: comment.description,
          },
        },
        KanbanTaskChecklistItemComment: {
          create: {
            name: comment.label,
          },
        },
      },
    });
  }

  create(createKanbanTaskDto: CreateKanbanTaskDto) {
    return 'This action adds a new kanbanTask';
  }
  async findAllBoard(boardId: string) {
    return await this.prisma.kanbanColumn.findMany({
      where: {
        kanbanId: boardId,
      },
      include: {
        tasks: {
          include: {
            KanbanTaskLabel: true,
            KanbanTaskAttachment: true,
          },
        },
      },
    });
  }

  async findTaskDetails(id: string) {
    return await this.prisma.kanbanTask.findUnique({
      where: {
        id,
      },
      include: {
        KanbanTaskLabel: true,
        KanbanTaskAttachment: true,
        KanbanTaskChecklist: {
          include: {
            KanbanTaskChecklistItem: {
              include: {
                KanbanTaskChecklistItemLabel: true,
                KanbanTaskChecklistItemAttachment: true,
              },
            },
          },
        },
        KanbanTaskComment: {
          include: {
            KanbanTaskCommentLabel: true,
            KanbanTaskCommentAttachment: true,
          },
        },
      },
    });
  }

  async findAllCommentsInTask(taskId: string) {
    return await this.prisma.kanbanTaskComment.findMany({
      where: {
        taskId,
      },
      include: {
        KanbanTaskCommentLabel: true,
        KanbanTaskCommentAttachment: true,
      },
    });
  }

  async createCommentInTask(
    label: string,
    description: string,
    taskId: string,
  ) {
    console.log(label, description, taskId);
    return await this.prisma.kanbanTaskComment.create({
      data: {
        name: label,
        KanbanTaskCommentLabel: {
          create: {
            name: label,
          },
        },
        KanbanTaskCommentAttachment: {
          create: {
            name: description,
          },
        },
        task: {
          connect: {
            id: taskId,
          },
        },
      },
      include: {
        KanbanTaskCommentLabel: true,
        KanbanTaskCommentAttachment: true,
      },
    });
  }

  update(id: number, updateKanbanTaskDto: UpdateKanbanTaskDto) {
    return `This action updates a #${id} kanbanTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} kanbanTask`;
  }
}
