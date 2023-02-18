import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import {fileNamer} from './helpers/fileNamer.helper '

@Controller('files')
export class FilesController {
  constructor(
    private readonly consfigService: ConfigService,
    private readonly filesService: FilesService
    ) {}


  @Get('product/:imageName')
  findProducto(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    

    const path= this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);

  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    //limits: {}
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }))


  uploadProducImage(@UploadedFile() file: Express.Multer.File,){
    
    if (!file){
      throw new BadRequestException("Make sure that file is an image");
      
    }

    const secureUrl= `${this.consfigService.get('HOST_API')}/files/product/${file.filename}`;
    
    return {
      secureUrl
    };
  }
}
