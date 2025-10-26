export class Exception extends Error {
    constructor(public message: string, public statusCode: number) {
        super(message,);
    }

    toResponse() {
        return Response.json({
            message: this.message,
            statusCode: this.statusCode
        },{
            status: this.statusCode
        })
    }
}