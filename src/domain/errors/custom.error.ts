import { error } from "console";

//*Significa que CustomError hereda de la clase nativa Error de JavaScript.
export class CustomError extends Error {

    constructor(
        public readonly statusCode: number,
        public readonly message: string,

    ){
        //*Como tu clase extiende de Error, debes llamar a super().
        //*Eso le pasa el mensaje a la clase padre Error.        
        super(message);
    }
    //* Metdos factory

    static badRequest(message: string) {
        return new CustomError(400, message);
    };

    static unauthorized(message: string) {
        return new CustomError(401, message);
    };   

    static forbidden(message: string) {
        return new CustomError(403, message);
    };   

    static notFound(message: string) {
        return new CustomError(404, message);
    };   

    static internalServel(message: string) {
        return new CustomError(500, message);
    };   
    
}

