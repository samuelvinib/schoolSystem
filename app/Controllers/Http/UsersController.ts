import Database from '@ioc:Adonis/Lucid/Database';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';

interface ClassroomData {
    classroom_id: number;
    classroom_number: string;
    availability: string;
    professor_name: string;
}

export default class UsersController {

    private getUserData(auth: HttpContextContract['auth']) {
        const userData = auth.user;

        if (!userData) {
            throw new Error("Conta inválida.");
        }

        return userData;
    }

    protected async showAllUsers({ response }: HttpContextContract) {
        try {

            const query = await User.query().where('role', 'student');
            return response.ok(query);
        } catch (error) {
            return response.badRequest(error.message);
        }
    }

    protected async showAllClassrooms({ response, auth }: HttpContextContract) {
        try {
            const userData = this.getUserData(auth);

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

            const classrooms: ClassroomData[] = query.map(row => ({
                classroom_id: row.classroom_id,
                classroom_number: row.classroom_number,
                availability: row.availability,
                professor_name: row.professor_name,
            }));

            return response.ok(classrooms);
        } catch (error) {
            return response.badGateway(error.message);
        }
    }

    protected async show({ response, auth }: HttpContextContract) {
        try {
            const userData = this.getUserData(auth);

            const query = await User.findBy('id', userData.id);
            return response.ok(query);
        } catch (error) {
            return response.badGateway(error.message);
        }
    }

    protected async update({ request, response, auth }: HttpContextContract) {
        try {
            const bodyRequest = request.all();
            const userData = this.getUserData(auth);

            await Database
                .from('users')
                .where('email', userData.email)
                .update(bodyRequest, ['id'])
                .first();

            return response.ok({ message: "Dados alterados com sucesso!" });
        } catch (error) {
            return response.badGateway(error.message);
        }
    }

    protected async destroy({ auth, response }: HttpContextContract) {
        try {
            const userData = this.getUserData(auth);

            const user = await User.find(userData.id);

            if (!user) {
                return response.notFound({ error: 'Usuário não encontrado' });
            }

            await user.delete();

            return response.ok({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            console.error(error);
            return response.internalServerError({ error: 'Ocorreu um erro ao excluir o usuário' });
        }
    }
}
