import HttpBody from "./interfaces/http-body";

class HttpResponse extends Response {
    constructor(body: HttpBody) {
        const { data, headers, status } = body;
        super(JSON.stringify({ data}), { status, headers });
    }
}

export default HttpResponse