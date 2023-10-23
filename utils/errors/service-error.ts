import { HttpStatus } from "aws-sdk/clients/lambda";

const defaultMessage = "Service Error";

class ServiceError extends Error {
    status: number;
  constructor(message: string,status: HttpStatus) {
    super(message ?? defaultMessage);
    this.status = status;
  }
}


export default ServiceError;