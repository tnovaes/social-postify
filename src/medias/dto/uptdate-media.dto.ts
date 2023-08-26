import { IsString, IsNotEmpty } from "class-validator";
import { CreateMediaDto } from "./create-media.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}