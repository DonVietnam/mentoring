import {
  IsArray,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJiraTicketDto {
  @ApiProperty({ example: 'EA Games' })
  @IsString()
  StudioName: string;

  @ApiProperty({ example: '5-10' })
  @IsString()
  TeamSize: string;

  @ApiProperty({ example: 'Moscow, Russia' })
  @IsString()
  TeamLocation: string;

  @ApiProperty({ example: 'ea.games@gmail.com' })
  @IsEmail()
  Email: string;

  @ApiProperty({ example: 'BrightSeeker' })
  @IsString()
  GameTitle: string;

  @ApiProperty({
    example:
      'BrightSeeker is an action RPG set in a futuristic fantasy world where people and their mechanical constructs rose up against their gods.',
  })
  @IsString()
  GameDescription: string;

  @ApiProperty({ example: 'Single Player' })
  @IsString()
  GameType: string;

  @ApiProperty({ example: 'Action' })
  @IsString()
  Genre: string;

  @ApiProperty({ example: 'Isometric', required: false })
  @IsOptional()
  @IsString()
  Subgenre?: string;

  @ApiProperty({ example: 'https://www.google.com' })
  @IsUrl()
  Website: string;

  @ApiProperty({ example: 'https://www.kickstarter.com', required: false })
  @IsOptional()
  @IsUrl()
  Kickstarter?: string;

  @ApiProperty({ example: 'https://discord.com', required: false })
  @IsOptional()
  @IsUrl()
  Discord?: string;

  @ApiProperty({ example: 'https://youtube.com', required: false })
  @IsOptional()
  @IsUrl()
  Youtube?: string;

  @ApiProperty({ example: 'https://twitter.com', required: false })
  @IsOptional()
  @IsUrl()
  Twitter?: string;

  @ApiProperty({
    example: [
      'https://www.pinterest.com/pin/216876',
      'https://www.pinterest.com/pin/432123',
    ],
  })
  @IsArray()
  @IsUrl({}, { each: true })
  GameScreenshots: string[];

  @ApiProperty({ example: 'yes | no' })
  @ValidateIf((p) => ['yes', 'no'].includes(p))
  @IsString()
  DoYouHavePlayableBuild: string;

  @ApiProperty({
    example: 'https://store.steampowered.com/app/882590',
    required: false,
  })
  @IsOptional()
  @IsString()
  PlayableBuild?: string;

  @ApiProperty({ example: 'https://youtu.be/NyB_RIHGG18', required: false })
  @IsOptional()
  @IsUrl()
  VideoContent?: string;

  @ApiProperty({
    example:
      'https://funding-onepagers.s3.amazonaws.com/pitch-c66lmp7e2ib9s5bfv2rg.pdf ',
  })
  @IsString()
  ProductInfo: string;

  @ApiProperty({ example: 'Unity' })
  @IsString()
  GameEngine: string;

  @ApiProperty({ example: 'Premium (Buy-to-Play)' })
  @IsString()
  MonetizationModel: string;

  @ApiProperty({ example: '2021-01-01' })
  @IsDateString()
  DevelopmentStartDate: string;

  @ApiProperty({ example: 'Prototype' })
  @IsString()
  CurrentDevelopmentMilestone: string;

  @ApiProperty({ example: '2022-01-01' })
  @IsDateString()
  TargetLunchDate: string;

  @ApiProperty({ example: ['PC', 'MacOS'] })
  @IsArray()
  @IsString({ each: true })
  InitialReleasePlatforms: string[];

  @ApiProperty({ example: ['Android', 'iOS'] })
  @IsArray()
  @IsString({ each: true })
  MobilePlatforms: string[];

  @ApiProperty({ example: '$200.000', required: false })
  @IsOptional()
  @IsString()
  RequestedInvestmentAmount?: string;

  @ApiProperty({ example: '$250.000', required: false })
  @IsOptional()
  @IsString()
  ReusedInvestmentAmount?: string;

  @ApiProperty({ example: '$150.000', required: false })
  @IsOptional()
  @IsString()
  AmountSpendToDate?: string;

  @ApiProperty({ example: '$500.000', required: false })
  @IsOptional()
  @IsString()
  EstimatedTotalProductionAndMarketingBudged?: string;
}
