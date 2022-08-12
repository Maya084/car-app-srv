import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Report } from "../reports/report.entity";

@Entity()
@Unique(['username', 'email'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    lastName: string;

    @Column({ default: true })
    admin: boolean;

    @Column({ nullable: true })
    profileImage: string;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log('inserted used with id', this.id);
    }

    @AfterUpdate()
    logUpdate() {
        console.log('updated user with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('removed user with id', this.id);

    }
}