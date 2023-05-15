import { Body, Controller, Post, Patch, Get, Param, Query, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { Delete, Session } from '@nestjs/common/decorators';
import { CreateUserDTO } from './dtos/create-user.dto';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.inceptors';
import { UserDTO } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './users.entity';
import { CurrentUser } from './decorators/current-user';

@Controller('auth')
@Serialize(UserDTO)
export class UsersController {
   constructor(private userService: UsersService, private authService: AuthService) { }

   @Get('color/:color')
   setColor(@Param('color') color: string, @Session() session: any) {
      session.color = color
   }

   @Get('/colors')
   getColor(@Session() session: any) {
      return session.color
   }

   // @Get('/whoami')
   // whoAmI(@Session() session:any){
   //    return this.userService.findOne(session.userId)
   // }

   @Get('/whoami')
   whoAmI(@CurrentUser() user:User){
      return user
   }

   @Post('/signup')
   async createUser(@Body() body: CreateUserDTO, @Session() Session: any) {
      // this.userService.create(body.email, body.password)
      const user = await this.authService.signup(body.email, body.password)
      Session.userId=user.id
      return user;
   }

   // @UseInterceptors(new SerializeInterceptor(UserDTO))

   @Post('/signout')
   async signOut(@Session() Session:any){
      Session.userId=null;
   }

   @Get('/:id')
   async findUser(@Param('id') id: string) {
      const a = await this.userService.findOne(parseInt(id))
      return this.userService.findOne(parseInt(id))
   }

   @Post('/signin')
   async signin(@Body() body: CreateUserDTO, @Session() Session: any) {
      const user = await this.authService.signin(body.email, body.password)
      Session.userId=user.id
      return user;
   }

   @Get()
   listUser(@Query('email') email: string) {
      return this.userService.find(email)
   }

   @Delete('/:id')
   removeUser(@Param('id') id: string) {
      return this.userService.remove(parseInt(id))
   }

   @Patch('/:id')
   updateUser(@Param('id') id: string, @Body() body: UpdateUserDTO) {
      return this.userService.update(parseInt(id), body)
   }
}
