export class ApiResponse<T> {
    constructor(
        public data: T,
        public message: string,
        public statusCode = 200
    ) {}

    toResponse() {
        return Response.json({
            data: this.data,
            message: this.message,
            statusCode: this.statusCode
        },{
            status: this.statusCode
        });
    }
}
