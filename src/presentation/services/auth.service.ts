import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, UserEntity } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";



export class AuthService {

    // DI inyectar servicio authservice
    constructor(       
    ){};


    public async registerUser(registerUserDto: RegisterUserDto) {

        const user = await  UserModel.findOne({
            email: registerUserDto.email,
        });
        if ( user )
             throw CustomError.badRequest('Email already exist!');
        try {            
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return {
                user : userEntity, 
                token: 'ABC'
            };            
        } catch (error) {
            throw CustomError.internalServel(`${error}`);            
        }     
    };

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({
            email : loginUserDto.email,
        });
        
        try {
            if ( user) {
               if ( !bcryptAdapter.compare(loginUserDto.password, user.password) ) 
               throw CustomError.badRequest('Password is invalid!');               
                           
               const { password, ...userEntity} = UserEntity.fromObject(user);

                // Crear Token
                const token = await JwtAdapter.generateToken({
                    id: user.id,
                    email: user.email,
                });

                if( !token ) throw CustomError.internalServel('Impossible to create token!');

               return {
                   user: userEntity,
                   token: token,
               };
            };            
            throw CustomError.badRequest('Email not exist!');
        } catch (error) {            
           throw CustomError.internalServel(`${error}`);
        }

    };

};