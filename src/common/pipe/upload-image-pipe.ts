import {
    BadRequestException,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
} from '@nestjs/common';

export const ImageUploadPipe = new ParseFilePipe({
    validators: [
        new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: 'Maximum size allowed is 10MB.',
        }),
        new FileTypeValidator({
            fileType: '.(png|jpeg|jpg|webp|heic|heif)',
        }),
    ],
    exceptionFactory: (error) =>
        new BadRequestException(`Invalid image upload: ${error}`),
});
