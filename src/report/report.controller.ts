import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import GetDailyReportDto from './dto/getDailyReport.dto';
import ReportService from './report.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('report')
@Controller('report')
export default class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  async createOrder(@Query() query: GetDailyReportDto) {
    return this.reportService.getDailyReport(query);
  }
}
