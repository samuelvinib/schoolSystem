import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {

    public register({ request}: HttpContextContract){
        return request.all();
    }

    public login({ request, response, auth }: HttpContextContract){
        return request.all();
    }

}
