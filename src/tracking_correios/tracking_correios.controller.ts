import {
  Controller,
  Post,
  Sse,
  MessageEvent,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable } from 'rxjs';
import { TrackingCorreiosService } from './tracking_correios.service';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Controller('tracking-correios')
export class TrackingCorreiosController {
  constructor(
    private readonly trackingCorreiosService: TrackingCorreiosService,
  ) {}

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ): Promise<void> {
    if (!file) {
      throw new HttpException('Arquivo não encontrado', HttpStatus.BAD_REQUEST);
    }

    try {
      const codes = await this.trackingCorreiosService.importExcelFile(file.buffer);
      const results = await this.trackingCorreiosService.processBatches(codes, (progress) => {
        this.trackingCorreiosService['progressSubject'].next(progress);
      });
      
      res.status(HttpStatus.OK).json({ results });

    } catch (error) {
      console.error('Erro ao importar arquivo:', error);
      throw new HttpException('Erro ao importar arquivo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
