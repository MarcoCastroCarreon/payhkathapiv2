import { HttpStatus } from "@utils/enums/http-status";
import HttpResponse from "@utils/http-response";

class HttpError extends HttpResponse {
    constructor(status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR, message: string = 'Internal Server Error') {
        super({ data: message, status  });
    }
}

export default HttpError;