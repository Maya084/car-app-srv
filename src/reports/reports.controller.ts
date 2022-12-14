import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApproveDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {

    constructor(private reportsService: ReportsService) {
    }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(
        @Body() body: CreateReportDto,
        @CurrentUser() currentUser: User
    ) {
        return this.reportsService.create(body, currentUser)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }

    @Get()
    getAllReports() {
        return this.reportsService.getAllReports();
    }

    @Get('/estimate')
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportsService.createEstimate(query);
    }

    @Get('/user/:id')
    reportsForUser(@Param('id') id: string) {
        return this.reportsService.reportsForUser(id);
    }

    @Delete('/:id')
    @UseGuards(AuthGuard)
    deleteReport(@Param('id') id: string) {
        return this.reportsService.deleteReport(parseInt(id));
    }
}
