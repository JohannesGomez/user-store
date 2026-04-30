import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, UserEntity } from "../../domain";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { EmailService } from "./email.service";



export class AuthService {

    // DI inyectar servicio authservice
    constructor(      
        // DI
        private readonly emailService: EmailService, 
    ){};


    public async registerUser(registerUserDto: RegisterUserDto) {

        const user = await  UserModel.findOne({
            email: registerUserDto.email,
        });
        if ( user )
             throw CustomError.badRequest('Email already exist');
        try {            

            const user = new UserModel(registerUserDto);

            // Encriptar contraseña
            user.password = bcryptAdapter.hash(registerUserDto.password);
            await user.save();

            // Email de confirmacion
            await this.sendEmailValidationLink( user.email );            
            // Crear Token
            const token = await JwtAdapter.generateToken({id: user.id,});
            if( !token ) throw CustomError.internalServel('Impossible to create token');

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return {
                user : userEntity, 
                token: token,
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
                throw CustomError.badRequest('Password is invalid');               
                           
                const { password, ...userEntity} = UserEntity.fromObject(user);
                const token = await JwtAdapter.generateToken({
                    id: user.id,
                });

                if( !token ) throw CustomError.internalServel('Impossible to create token');

               return {
                   user: userEntity,
                   token: token,
               };
            };            
            throw CustomError.badRequest('Email not exist');
        } catch (error) {            
           throw CustomError.internalServel(`${error}`);
        }

    };

    private sendEmailValidationLink =  async ( email: string) => {
        // Token ..payload
        const token = await JwtAdapter.generateToken({ email });
        if( !token ) throw CustomError.internalServel('Impossible to create token');

        // link de retorno
        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;

        const htmlBody = `
            <h1>Validate your  email</h1>
            <p>Click on the following link to validate your  email</p>
            <a href="${ link }">Validate your email: ${ email }</a>       
        `;

        const options = {
            to: email,
            subject: 'Validate your email !',
            htmlBody : htmlBody,
        }

        const isSend = await this.emailService.sendEmail(options);
        if( !isSend ) throw CustomError.internalServel('Email could not be sent')
        return true;

    }
    
    public validateEmail = async( token: string )=> {

        const payload = await JwtAdapter.validateToken(token);
        if ( !payload ) throw CustomError.unauthorized('Token is invalid');

        const { email } = payload as { email:string };
        if ( !email ) throw CustomError.internalServel('Email not in token');

        const user = await UserModel.findOne( { email } );
        if ( !user ) throw CustomError.internalServel('Email not exits');

        user.emailValidated = true; 
        await user.save();
    }

};