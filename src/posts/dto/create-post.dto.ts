import { IsString, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    text: string;

    @IsOptional()
    @IsString()
    @IsUrl()
    image: string;
}