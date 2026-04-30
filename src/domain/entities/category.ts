import { CustomError } from "../errors/custom.error";


export class CategoryEntity {

    constructor(
        public name: string,
        public available: boolean,
    ){};


    static fromObject( object: { [key:string]:any } ) {
        
        // emailValidated se valida con undefined porque es booleam
        const { id, _id, name, available } = object;

        if ( !id && !_id ) throw CustomError.badRequest('Missing id !');
        if ( !name ) throw CustomError.badRequest('Missing name !');
        
        return new CategoryEntity(
            id || _id, 
            name, 
        )
    };

};
