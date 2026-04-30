// Verificar nuestro Body y transformarlo

//import { CustomError } from "../../errors/custom.error";

export class GetCategoryDto {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly available: boolean,
    ){}

    static create( object: { [ key: string ]: any } ) : [string?,  GetCategoryDto?]
     {
        
        const  { id, name, available}  = object;

        return [undefined, new GetCategoryDto(id, name, available)];        
     }

}


