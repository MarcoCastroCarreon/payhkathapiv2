import HttpBody from "./interfaces/http-body";

class HttpResponse extends Response {
  constructor(body: HttpBody) {
    let { data, headers, status, error } = body;
    if (!headers) {
      headers = {
        "Content-Type": "application/json",
      };
    }
    super(JSON.stringify({ data, error }), { status, headers });
  }
}

export default HttpResponse;
