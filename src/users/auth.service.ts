import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Hash, randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
import { UsersService } from "./users.service";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {

    constructor(private userService: UsersService) {

    }

    async signup(email: string, password: string) {
        const user = await this.userService.find(email);

        //check if email is in use
        if (user.length) {
            throw new BadRequestException('email in use');
        }

        //hash pass
        //generate salt
        const salt = randomBytes(8).toString('hex');
        //1 byte gives 2 characters in hex => 16 long salt


        //hash salt and pass
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        //join hash with salt
        const res = salt + '/' + hash.toString('hex');

        //create a new user and save
        const newUser = await this.userService.create(email, res);

        return newUser;
    }

    async signin(email: string, password: string) {
        const [user] = await this.userService.find(email);

        if (!user) {
            throw new NotFoundException('user not found');
        }

        const [salt, storedHash] = user.password.split('/');

        const hash = ((await scrypt(password, salt, 32)) as Buffer).toString('hex');

        if (storedHash !== hash) {
            throw new BadRequestException('bad password');
        }
        return user;
    }

}