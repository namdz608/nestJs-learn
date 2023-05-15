import { Injectable, BadRequestException } from "@nestjs/common"
import { UsersService } from "./users.service"
import { randomBytes, scrypt as _scrypt } from "crypto"
import { promisify } from "util"
import { NotFoundException } from "@nestjs/common/exceptions"

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(private userServices: UsersService) {

    }
    async signup(email: string, password: string) {
        //Check exist Email
        const users = await this.userServices.find(email)
        if (users.length) {
            throw new BadRequestException('email in use')
        }
        //Hash Password
        //Generate Salt
        const salt = randomBytes(8).toString('hex')

        //Hash Salt and pass together
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        //Jion the hash result and salth together
        const result = salt + '.' + hash.toString('hex')

        //Create User and Save it
        const user = await this.userServices.create(email, result)
        //return user data
        return user
    }

    async signin(email: string, password: string) {
        //dau ngoac vuong la tra ve 1 User
        const [user] = await this.userServices.find(email)
        if(!user){
            throw new NotFoundException('User Not Found')
        }
        const[salt,stroredHash]=user.password.split('.')
        console.log('salt and storedHash',salt,stroredHash)

        const hash=(await scrypt(password,salt,32)) as Buffer
        if(stroredHash===hash.toString('hex')){
            return user;
        }
        else{
            throw new BadRequestException('Wrong pass')
        }
    }
}