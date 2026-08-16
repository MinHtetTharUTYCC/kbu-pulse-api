import { ApiProperty } from '@nestjs/swagger';

export class UploadImagesResponseDto {
    @ApiProperty({ type: [String] })
    imageUrls: string[];
}
