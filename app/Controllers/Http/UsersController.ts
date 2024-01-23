import Database from '@ioc:Adonis/Lucid/Database';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {


    protected async show({ response, auth}: HttpContextContract){
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }   

        const query = await User.findBy('id',userData.id)
        return response.ok(query);
    }

    protected async update({ request, response, auth}: HttpContextContract){

        const bodyRequest = request.all();
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }    

        try{
            await Database
                .from('users')
                .where('email',userData.email)
                .update(bodyRequest, ['id'])
                .first()
            
            return response.ok({message:"Dados alterados com sucesso!"})
        }catch(e){
            return response.badGateway(e)
        }
    }

    protected async destroy({auth, response}: HttpContextContract){

        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }   

        try {
            // Encontre o usuário pelo ID
            const user = await User.find(userData.id)
      
            // Verifique se o usuário existe
            if (!user) {
              return response.notFound({ error: 'Usuário não encontrado' })
            }
      
            // Deleta o usuário
            await user.delete()
      
            // Responde com uma mensagem de sucesso
            return response.ok({ message: 'Usuário excluído com sucesso' })
          } catch (error) {
            // Se ocorrer um erro durante a exclusão, responda com um erro 500
            console.error(error)
            return response.internalServerError({ error: 'Ocorreu um erro ao excluir o usuário' })
          }
    }
}
