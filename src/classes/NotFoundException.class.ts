import { HttpException } from ".";

export class NotFoundException extends HttpException {

    private static readonly status: number = 404; // default status: 400

    constructor(message = 'Resource not found') {
        super(NotFoundException.status, message);
    }
}
