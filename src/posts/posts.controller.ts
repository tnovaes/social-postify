import { Get, Post, Put, Delete, Body, Param, Controller, HttpCode, ParseIntPipe } from '@nestjs/common';
import * as httpStatus from 'http-status';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Post()
    @HttpCode(httpStatus.CREATED)
    create(@Body() createPostDto: CreatePostDto) {
        return this.postsService.create(createPostDto);
    }

    @Get()
    findAll() {
        return this.postsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: string) {
        return this.postsService.findOne(+id);
    }

    @Put(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    update(
        @Param('id', ParseIntPipe) id: string,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postsService.update(+id, updatePostDto);
    }

    @Delete(':id')
    @HttpCode(httpStatus.NO_CONTENT)
    remove(@Param('id', ParseIntPipe) id: string) {
        return this.postsService.delete(+id);
    }
}

