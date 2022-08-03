import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ApproveDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
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
    approveReport(@Param('id') id: string, @Body() body: ApproveDto) {
        return this.reportsService.changeApproval(id, body.approved);
    }
}
