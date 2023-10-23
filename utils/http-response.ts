import HttpBody from "./interfaces/http-body";

class HttpResponse extends Response {
    constructor(body: HttpBody) {
        let { data, headers, status } = body;
        if(!headers) {
            headers = {
                "Content-Type": "application/json"
            } 
        }
        super(JSON.stringify({ data}), { status, headers });
    }
}

export default HttpResponse