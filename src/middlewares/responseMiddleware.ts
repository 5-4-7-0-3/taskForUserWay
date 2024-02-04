import { HttpStatus, BadRequestException, NotFoundException, HttpException } from '@nestjs/common';

export class ResponseDto<T> {
    constructor(public status_code: HttpStatus, public result: T, public message: string) { }
}

export class CustomResponse {
    constructor() {
    }

    async generateResponse<T>(status_code: HttpStatus, result: T, message: string): Promise<ResponseDto<T>> {
        return new ResponseDto(status_code, result, message);
    }
}