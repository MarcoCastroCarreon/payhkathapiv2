import middy from "@middy/core";
import connection from "@persistence/connection";
import HttpResponse from "@utils/http-response";
import { IAWSRequest } from '@utils/types/aws-request.type';
import { HttpStatus } from '@utils/enums/http-status';

async function handler(request: IAWSRequest): Promise<Response> {
  const reqBody = JSON.parse(request.aws?.body ?? '{}') ;

  return new HttpResponse({
    data: reqBody,
    status: HttpStatus.CREATED,
  });
}

export const execute = middy(handler).before(connection);
