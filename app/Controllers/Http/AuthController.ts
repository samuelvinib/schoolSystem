import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/User';

export default class AuthController {

    protected async register({ request, response }: HttpContextContract) {
        let data: object = request.all();
        const hash_password = Hash.make(data['password']);
        data['password'] = await hash_password;
        data['created_at'] = new Date();
        data['updated_at'] = new Date();

        try {
            const insertedUser = await Database
                .table('users')
                .returning('id')
                .insert(data)
            
            return response.status(201).json({
                success: true,
                data: {
                    user: {
                        id: insertedUser[0],
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

        try {
            let user = await User
                .query()
                .where('email', email)
                .select({
                    id: 'id',
                    userEmail: 'email',
                    Userpassword: 'password'
                })
                .firstOrFail()


            // Verify password
            if (!(await Hash.verify('$scrypt$n=16384,r=8,p=1$tAW1k6vz7YGvcYeoO22RQQ$zSrz+tE128ix39bm6DTFm93sR/9JphZ0Ghl/URawjCKXVdVyBK1NTPqO8zxqII9+RPo1vhs6+ICNvM/PmQxAxw', password))) {
                return response.unauthorized('Invalid credentials')
            }


            const token = await auth.use('api').generate(user)
            return token;

        } catch (e) {
            return response.status(500).json({
                error: e['sqlMessage']
            })
        }
    }

}
