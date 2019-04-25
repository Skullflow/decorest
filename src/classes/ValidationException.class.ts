import { HttpException } from "./httpException.class";
import { ValidationError } from "class-validator";

export class ValidationException extends HttpException {
    public validationErrors: ValidationError[];

    constructor(validationErrors: ValidationError[]) {
        super(400, 'Validation error'); // default status: 400
        this.validationErrors = validationErrors;
    }
}