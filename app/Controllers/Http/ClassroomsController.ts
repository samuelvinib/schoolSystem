import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ClassroomsController {

    protected get({auth, response}: HttpContextContract){
        return response.json({
            data: auth.user,
        })
    }
}
