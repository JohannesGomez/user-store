
import { Request, Response } from "express"
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";



export class AuthController {

    //* I.D
    constructor(

    ){}

// [
//   undefined,
//   RegisterUserDto {
//     name: 'johannes',
//     email: 'johannes.gomez@gmail.com',
//     password: '1234567'
//   }
// ]

    registerUser = (req:Request, res:Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body)
        if( error ) return res.status(400).json({error})
        res.json(registerUserDto);
    }

    loginUser = (req:Request, res:Response) => {

        res.json('login user');

    }
    
    validateEmail = (req:Request, res:Response) => {

        res.json('validate email');

    }    

}



