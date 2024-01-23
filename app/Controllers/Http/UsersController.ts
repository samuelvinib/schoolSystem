import Database from '@ioc:Adonis/Lucid/Database';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {

    protected async showAllUsers({ response, auth }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        const query = await User.query()
            .where('role', 'student')
        return response.ok(query);
    }

    protected async showAllClassrooms({ response, auth }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            const query = await Database
                .query()
                .from('user_classrooms as uc')
                .leftJoin('classrooms as c', 'uc.classroom_id', '=', 'c.id')
                .leftJoin('users as professor', 'professor.id', '=', 'c.professor_id')
                .select(
                    'c.id as classroom_id',
                    'c.class_number as classroom_number',
                    'c.availability as availability',
                    'professor.name as professor_name',
                )
                .where('uc.user_id', userData.id);

            const classrooms = query.reduce((result, row) => {
                result.push({
                    classroom_id: row.classroom_id,
                    classroom_number: row.classroom_number,
                    availability: row.availability,
                    professor_name: row.professor_name,
                });
                return result;
            }, []);
            return response.ok(classrooms);
        } catch (e) {
            return e;
        }

    }

    protected async show({ response, auth }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        const query = await User.findBy('id', userData.id)
        return response.ok(query);
    }

    protected async update({ request, response, auth }: HttpContextContract) {

        const bodyRequest = request.all();
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            await Database
                .from('users')
                .where('email', userData.email)
                .update(bodyRequest, ['id'])
                .first()

            return response.ok({ message: "Dados alterados com sucesso!" })
        } catch (e) {
            return response.badGateway(e)
        }
    }

    protected async destroy({ auth, response }: HttpContextContract) {

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
