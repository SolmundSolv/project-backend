import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { Observable, of } from 'rxjs';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: CreateImageDto) {
    return this.imageService.create(createImageDto);
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('media', {
      storage: diskStorage({
        destination: './src/img',
        filename: (req, file, cb) => {
          const filename: string = file.originalname;
          cb(null, `${filename}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file): Observable<Object> {
    return file;
  }
  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':name')
  findOne(@Param('name') name: string, @Res() res): Observable<Object> {
    return of(res.sendFile(process.cwd() + '/src/img/' + name));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImageDto: UpdateImageDto) {
    return this.imageService.update(+id, updateImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
