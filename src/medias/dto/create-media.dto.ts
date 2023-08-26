import { IsString, IsNotEmpty } from "class-validator";

export class CreateMediaDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    username: string;
}