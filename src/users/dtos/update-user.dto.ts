import { IsString,IsEmail ,IsOptional} from "class-validator"

export class UpdateUserDTO {
    @IsEmail()
    @IsOptional()

    email:string

    @IsOptional()
    password:string
}