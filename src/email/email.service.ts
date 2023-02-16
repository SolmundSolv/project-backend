import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer/dist';

@Injectable()
export class EmailService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private mail: MailerService,
  ) {}

  async createTemplate({ name, subject, message }: CreateEmailDto) {
    const variables = this.retriveVariables(message);
    //add variables from subject to variables
    const subjectVariables = this.retriveVariables(subject);
    subjectVariables.forEach((variable) => {
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    });
    const template = await this.prisma.emailTemplate.create({
      data: {
        name,
        subject,
        message,
      },
    });
    for (let i = 0; i < variables.length; i++) {
      await this.prisma.emailTemplateVariable.create({
        data: {
          name: variables[i],
          value: '',
          EmailTemplate: {
            connect: {
              id: template.id,
            },
          },
        },
      });
    }
    return template;
  }

  async updateTemplate({ name, subject, message }: UpdateEmailDto, id: string) {
    const variables = this.retriveVariables(message);
    //add variables from subject to variables

    const subjectVariables = this.retriveVariables(subject);
    subjectVariables.forEach((variable) => {
      if (!variables.includes(variable)) {
        variables.push(variable);
      }
    });
    const template = await this.prisma.emailTemplate.update({
      where: {
        id,
      },
      data: {
        name,
        subject,
        message,
      },
    });
    const templateVariables = await this.prisma.emailTemplateVariable.findMany({
      where: {
        emailTemplateId: id,
      },
    });
    const templateVariablesNames = templateVariables.map(
      (variable) => variable.name,
    );
    for (let i = 0; i < variables.length; i++) {
      if (!templateVariablesNames.includes(variables[i])) {
        await this.prisma.emailTemplateVariable.create({
          data: {
            name: variables[i],
            value: '',
            EmailTemplate: {
              connect: {
                id: template.id,
              },
            },
          },
        });
      }
    }
  }
  retriveVariables(template: string) {
    const pattern = /{{(.*?)}}/g;
    const variables = [];
    if (template.includes('blocks') === false) {
      variables.push(pattern.exec(template)[1]);
    } else {
      const rawContent = JSON.parse(template);
      const blocks = rawContent.blocks;
      blocks.forEach((block) => {
        const text = block.text;
        let match;
        while ((match = pattern.exec(text))) {
          variables.push(match[1]);
        }
      });
    }
    return variables;
  }
  async deleteTemplate(id: string) {
    return await this.prisma.emailTemplate.delete({
      where: {
        id,
      },
    });
  }

  async sendEmailWithTemplate(
    email: string,
    template: string,
    data: {
      [key: string]: string;
    },
  ) {
    const emailTemplate = await this.prisma.emailTemplate.findFirst({
      where: {
        name: template,
      },
      include: {
        EmailTemplateVariables: true,
      },
    });
    console.log(data, template, email);
    const variables = emailTemplate.EmailTemplateVariables;
    const raw = JSON.parse(emailTemplate.message);
    let message = '';
    raw.blocks.forEach((block) => {
      message += block.text + '<br>';
    });
    variables.forEach((variable) => {
      message = message.replace(
        new RegExp(`{{${variable.name}}}`, 'g'),
        data[variable.name],
      );
    });
    let subject = emailTemplate.subject;
    variables.forEach((variable) => {
      subject = subject.replace(
        new RegExp(`{{${variable.name}}}`, 'g'),
        data[variable.name],
      );
    });
    const mailOptions = {
      from: 'konradqxd@gmail.com',
      to: email,
      subject,
      html: message,
    };

    this.mail.sendMail(mailOptions).then((res) => {
      if (res.error) {
        return res.error;
      } else {
        return this.prisma.email.create({
          data: {
            email: email,
            message: message,
            EmailTemplate: {
              connect: {
                id: emailTemplate.id,
              },
            },
          },
        });
      }
    });
  }

  async findAllTemplates() {
    return await this.prisma.emailTemplate.findMany({
      select: {
        id: true,
        name: true,
        subject: true,
        message: true,
      },
    });
  }

  async findAllEmails() {
    return await this.prisma.email.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        EmailTemplate: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
