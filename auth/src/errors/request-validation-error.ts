import { ValidationError } from 'express-validator';
import {CustomError} from './custom-error'
// interface CustomError {
//   statusCode: number;
//   serializeErrors() : {
//     message: string;
//     field?: string;
//   }[]
// }
// didn't use interface as we can't check instance of when it converts to js
export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor(public errors: ValidationError[]) {
    super('Invalid Request');

    //Only bcoz we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param};
    })
  }
}