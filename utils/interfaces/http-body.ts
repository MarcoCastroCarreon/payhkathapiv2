import { HttpStatus } from "utils/enums/http-status";

export default interface HttpBody {
  data: any;
  status: HttpStatus;
  headers?: { [key: string]: any };
  error?: string
}
