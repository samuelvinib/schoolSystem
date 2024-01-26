import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

interface BodyReturn {
    name:string,
    email:string,
    registration:number,
    birthdate:string,
    password:string,
    role:string
}

export default class AuthController {

    protected async register({ request, response }: HttpContextContract) {
        

        try {
            const data: BodyReturn = request.all();
            const user = await User.create(data);

            console.log('Usuário criado com sucesso:', user);
            return response.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user.id,
                        username: data['name'],
                        email: data['email'],
                        role: data['role']
                    },
                    message: 'Usuário registrado com sucesso!'
                }
            });
        } catch (e) {
            return response.status(500).json({
                error: e['sqlMessage']
            })
        }
    }

    protected async login({ request, response, auth }: HttpContextContract) {

        const email = request.input('email')
        const password = request.input('password')
        let token:Object ={};

        try {
            token = await auth.use('api').attempt(email, password, {
                expiresIn: '30 mins'
              });
            return token;
          } catch (error) {
            return response.unauthorized({
                "message":"Usuário ou senha incorretos."
            })
          }
    }

}