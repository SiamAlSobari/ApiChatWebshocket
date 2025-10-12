export class HttpException extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpException";
    this.status = status;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}
