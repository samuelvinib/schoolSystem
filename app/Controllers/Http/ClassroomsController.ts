import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Classroom from 'App/Models/Classroom'
import UserClassroom from 'App/Models/UserClassroom';

export default class ClassroomsController {

    protected async get({ auth, response }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            const query = await Classroom
                .query()
                .where('teacher_id', userData.id)
                .with('user_classrooms', (builder) => {
                    builder.from('users').select('id', 'email')
                }, ['id', 'email'])
                .select('*');


            // const query = await Classroom.query().where('teacher_id', userData.id);
            console.log(query);
            return query;
        } catch (e) {
            console.log(e)
            return response.badGateway({ error: e.message })
        }
    }

    protected async addStudent({ auth, response }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        const query = UserClassroom.create({
            user_id: 13,
            classroom_id: 1
        })

        return query;

    }

    protected async create({ auth, response, request }: HttpContextContract) {
        const bodyRequest = request.all();
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            const query = await Classroom.create({
                teacher_id: userData.id,
                class_number: bodyRequest.class_number,
                student_capacity: bodyRequest.student_capacity,
            });
            return query;
        } catch (e) {
            return response.badGateway({ e })
        }
    }

    protected async destroy({ params }: HttpContextContract){
        const { classroomId } = params;
        return classroomId;
    }
}
