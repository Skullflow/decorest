import { HttpException } from "./httpException.class";

export class UnauthorizedException extends HttpException {

    private static readonly status: number = 401; // default status: 401

    constructor(message = "Unauthorized") {
        super(UnauthorizedException.status, message);
    }
}