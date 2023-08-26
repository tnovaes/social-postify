import { Get, Post, Put, Delete, Body, Param, Controller, HttpCode, ParseIntPipe } from '@nestjs/common';
import { MediasService } from './medias.service';
import * as httpStatus from 'http-status';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/uptdate-media.dto';

@Controller('medias')
export class MediasController {
    constructor(private readonly mediasService: MediasService) {}

    @Post()
    @HttpCode(httpStatus.CREATED)
    create(@Body() createMediaDto: CreateMediaDto) {
        return this.mediasService.create(createMediaDto);
    }

    @Get()
    findAll() {
        return this.mediasService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.mediasService.findOne(+id);
    }

    @Put(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updateMediaDto: UpdateMediaDto,
    ) {
        return this.mediasService.update(+id, updateMediaDto);
    }

    @Delete(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.mediasService.delete(+id);
    }
}
