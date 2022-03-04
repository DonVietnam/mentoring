import { ApiProperty } from '@nestjs/swagger';

export class CalendarEventAttendee {
  @ApiProperty({
    example: 'test@gmail.com',
    description: 'attendee email',
  })
  email: string;
  @ApiProperty({
    example:
      'https://s.gravatar.com/avatar/2d06881f72f07050e47d1cb7c715d895?s=200',
    description: 'attendee photo url',
  })
  photoUrl?: string;
  @ApiProperty({
    example: 'John Sevens',
    description: 'attendee display name',
  })
  displayName?: string;
  @ApiProperty({
    example: 'Back-end Developer',
    description: 'attendee role',
  })
  role?: string;
  @ApiProperty({
    example: '@Xsolla',
    description: 'attendee company',
  })
  company?: string;
}
