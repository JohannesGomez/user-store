import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { UserEntity } from "../entities/user.entity";



export class AuthMiddleware {

    /* 
    Si hay que hacer D.I( inyección de Dependencia)
    se crea una instancia de lo contrario se puede
    crear un metodo estático       
    */

    static async validateJWT( req: Request, res: Response, next: NextFunction) {

        const authorization = req.header('Authorization');

        if( !authorization ) res.status(400).json( {error: 'No token provider'});

        if( !authorization?.startsWith('Bearer') ) return res.status(401).json( {error: 'Invalid Bearer token'});
        
        const token = authorization.split(' ').at(1) || '';

        try {
            // <T> : esperando un objeto que tenga el id de tipo string
            const payload = await JwtAdapter.validateToken<{ id: string }>( token );
            if ( !payload ) return res.status(401).json({error:'Invalid token'});

            const user = await UserModel.findById( payload.id );
            if ( !user ) return res.status(401).json({error:'Invalid token - user'});

            // todo : validar si el usuario esta activo
            req.body.user = UserEntity.fromObject(user); // Grabar en el body el UserEntity con todos los datos del usuario
            next(); // Continue proximo middleware
            
        } catch (error) {
          console.log( error );
          res.status(500).json('Internal server error');            
        }
    }   

}
/*
Si authorization no existe, o si no comienza con Bearer, entonces hay error”.
El ?. evita que el programa falle si authorization viene undefined.
*/

        /*
        token va ha venir por los headers de autenticacion
        como un Bearer Token
        Bearer significa algo como “portador”. Es decir: 
        “el que porta este token tiene permiso para acceder”        

        POST /api/login HTTP/1.1
        Host: localhost:3000
        Content-Type: application/json
        Authorization: Bearer abc123

        {
        "email": "test@test.com",
        "password": "123456"
        }
        */
