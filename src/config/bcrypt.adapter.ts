import { compare, compareSync, genSaltSync, hashSync } from 'bcryptjs'


export const bcryptAdapter = {

    hash: (password: string) => {
        const salt = genSaltSync();
        return hashSync(password, salt);
    },

    compare: (password: string, hashed: string) => {
        return compareSync(password, hashed);
    }

}

/**
 * ¿Qué es salt?
  El salt es un valor aleatorio que se mezcla con la contraseña 
  antes de generar el hash.
 **/ 
