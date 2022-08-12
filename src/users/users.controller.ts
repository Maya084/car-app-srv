import {
    Body, Controller, Delete, Get,
    NotFoundException, Param, Patch,
    Post, Res, Session, UploadedFile, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';

const storage = {
    storage: diskStorage({
        destination: './uploads/profileImages',
        filename: (req, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`)
        }
    })
};

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(
        private userService: UsersService,
        private authService: AuthService
    ) { }

    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createNewUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signup(body);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: SignInUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userId = null;
    }

    @Post('/upload')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(@UploadedFile() file: Express.Multer.File, @Session() session: any) {
        return this.userService.update(session.userId, { profileImage: file.filename });
    }

    @Get('/upload/:image')
    @UseGuards(AuthGuard)
    findProfileImage(@Param('image') image: string, @Res() res) {
        return of(res.sendFile(join(process.cwd(), '/uploads/profileImages/' + image)));
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get('/:id')
    @UseGuards(AuthGuard)
    async findUser(@Param('id') id: string) {
        const user = await this.userService.findOne(parseInt(id));

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    // @Get()
    // findAllUsersWithEmail(@Query('email') email: string) {
    //     return this.userService.find(email);
    // }

    @Get()
    @UseGuards(AuthGuard)
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    patchUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.userService.update(parseInt(id), body);
    }
}
