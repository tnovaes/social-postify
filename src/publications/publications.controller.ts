import { Get, Post, Put, Delete, Body, Param, Controller, HttpCode, ParseIntPipe, Query } from '@nestjs/common';
import * as httpStatus from 'http-status';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Controller('publications')
export class PublicationsController {
    constructor(private readonly publicationsService: PublicationsService) {}

    @Post()
    @HttpCode(httpStatus.CREATED)
    create(@Body() createPublicationDto: CreatePublicationDto) {
        return this.publicationsService.create(createPublicationDto);
    }

    @Get()
    findAll(
        @Query('published') published: string | null,
        @Query('after') after: string | null,
    ) {
        return this.publicationsService.findAll(published, after);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.publicationsService.findOne(+id);
    }

    @Put(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updatePublicationDto: UpdatePublicationDto,
    ) {
        return this.publicationsService.update(+id, updatePublicationDto);
    }

    @Delete(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.publicationsService.delete(+id);
    }
}
