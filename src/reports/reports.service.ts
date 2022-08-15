import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {

    constructor(
        @InjectRepository(Report) private repo: Repository<Report>
    ) { }

    create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        report.user = user;

        return this.repo.save(report);
    }

    async changeApproval(idReport: string, approved: boolean) {
        const id = parseInt(idReport);
        const report = await this.repo.findOne({ where: { id } });

        if (!report) {
            throw new NotFoundException('report not found');
        }

        report.approved = approved;
        return this.repo.save(report);
    }

    async createEstimate(estimateDto: GetEstimateDto) {
        return this.repo.createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make: estimateDto.make })//sql injection protection
            .andWhere('model = :model', { model: estimateDto.model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng: estimateDto.lng ?? 0 })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat: estimateDto.lat ?? 0 })
            .andWhere('year - :year BETWEEN -3 AND 3', { year: estimateDto.year })
            .andWhere('approved IS TRUE')
            .orderBy('mileage - :mileage', 'DESC')
            .setParameters({ mileage: estimateDto.mileage })
            .limit(3)
            .getRawOne()
    }

    async getAllReports() {
        return this.repo.find({
            relations: {
                user: true
            },
            select: {
                price: true,
                make: true,
                model: true,
                year: true,
                lng: true,
                lat: true,
                mileage: true,
                user: {
                    id: true,
                    username: true,
                    name: true,
                    lastName: true
                }
            }
        });
    }

    async reportsForUser(userId: string) {
        return this.repo.find({
            relations: {
                user: true
            },
            where: {
                user: {
                    id: parseInt(userId)
                }
            },
            select: {
                id: true,
                price: true,
                make: true,
                model: true,
                year: true,
                lng: true,
                lat: true,
                mileage: true,
                user: {}
            },
        })
    }

    async deleteReport(id: number) {
        const report = await this.repo.findBy({ id });

        if (!report) {
            throw new NotFoundException("report not found");
        }

        return this.repo.remove(report);
    }
}
