import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get()
  findAll() {
    return this.emailService.findAllEmails();
  }

  @Get('templates')
  findAllTemplates() {
    return this.emailService.findAllTemplates();
  }
  @Post('send')
  sendEmail(@Body() data: { email: string; template: string; variables: any }) {
    return this.emailService.sendEmailWithTemplate(
      data.email,
      data.template,
      data.variables,
    );
  }

  @Post('templates/:id')
  updateTemplate(
    @Param('id') id: string,
    @Body() updateEmailDto: UpdateEmailDto,
  ) {
    return this.emailService.updateTemplate(updateEmailDto, id);
  }
  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.emailService.deleteTemplate(id);
  }
  @Post('templates')
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.createTemplate(createEmailDto);
  }
}
