import { UseInterceptors, NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { plainToInstance } from "class-transformer";
import { UserDTO } from "src/users/dtos/user.dto";

interface ClassContructor{
    new(...args:any[]):{}
}

export function Serialize(dto: ClassContructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {

    }

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        return handler.handle().pipe(map((data: any) => {
            return plainToInstance(this.dto, data, {
                excludeExtraneousValues: true
            })
        }))
    }
}