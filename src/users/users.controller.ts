import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) {

    }

    @Get('/colors/:color')
    setColor(@Param('color') color: string, @Session() session: any){
        //set session value
        session.color = color;
    }

    @Get('/colors')
    getColor(@Session() session: any){
        //get session value
        return session.color;
    }

    @Post('/signup')
    createNewUser(@Body() body: CreateUserDto) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('/sigin')
    signIn(@Body() body: CreateUserDto) {
        return this.authService.signin(body.email, body.password);
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    patchUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
