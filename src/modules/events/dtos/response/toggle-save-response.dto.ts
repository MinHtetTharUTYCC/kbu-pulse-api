import { ApiProperty } from '@nestjs/swagger';

export class ToggleSaveResponseDto {
    @ApiProperty()
    isSaved: boolean;
}
