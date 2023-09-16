import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsDateString } from 'class-validator';

export class GetDailyReportDto {
  @ApiProperty({
    description: 'Start date of the daily report (YYYY-MM-DD)',
    example: '2023-09-15', // Add an example date
  })
  @IsDateString()
  @IsNotEmpty({ message: 'startDate is required' })
  startDate: string;

  @ApiProperty({
    description: 'End date of the daily report (YYYY-MM-DD)',
    example: '2023-09-15', // Add an example date
  })
  @IsDateString()
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: string;
}

export default GetDailyReportDto;
