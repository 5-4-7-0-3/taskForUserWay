import { Logger, LoggerService } from '@nestjs/common';

export class CustomLogger extends Logger implements LoggerService {
    constructor(context: string) {
        super(context);
    }

    log(method: string, message: string) {

        super.log(`[${method}] ${message}`);
    }

    error(method: string, message: string) {

        super.error(`[${method}] ${message}`);
    }

}
