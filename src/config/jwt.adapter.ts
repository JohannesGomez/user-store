import jwt from 'jsonwebtoken';
import  { envs } from './envs'



const JWT_SEED = envs.JWT_SEED

export class JwtAdapter {

    static async generateToken( payload:any, duration: string = '120' ) {        
        /**
         * SEED : 
         * Un valor secreto (clave secreta)
           Es básicamente una cadena (string) que se usa para firmar
           el token y garantizar que no sea modificado.
         */       
        return new Promise((resolve) => {
            jwt.sign(payload, JWT_SEED, {expiresIn: +duration}, (err, token) => {
                if(err) return resolve(null);
                resolve(token);
            });
        })
    }

    static validateToken(token:string) {
        // decoded : firma jwt web token en el payload
        return new Promise((resolve) => {
            jwt.verify( token, JWT_SEED, (err, decoded) => {
                if(err) return resolve(null);
                resolve(decoded);
            });            
            
        });
    }
    
}



