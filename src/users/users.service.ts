import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from 'util';
import { has } from 'lodash';

const scrypt = promisify(_scrypt);


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(data: CreateUserDto) {
        const user = this.repo.create(data);

        return this.repo.save(user);
    }

    findOne(id: number) {
        if (!id) { return null; }
        return this.repo.findOne({ where: { id } });
    }

    find(email: string) {
        return this.repo.findBy({ email });
    }

    getAllUsers() {
        return this.repo.find();
    }

    async update(id: number, attrs: Partial<User>) {

        if (has(attrs, 'password')) {
            const salt = randomBytes(8).toString('hex');
            const hash = (await scrypt(attrs.password, salt, 32)) as Buffer;
            const res = salt + '/' + hash.toString('hex');
            attrs.password = res;
        }

        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException("user not found");
        }

        return this.repo.remove(user);
    }
}
