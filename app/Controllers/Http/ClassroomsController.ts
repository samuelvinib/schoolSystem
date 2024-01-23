import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Classroom from 'App/Models/Classroom'
import UserClassroom from 'App/Models/UserClassroom';
import Database from '@ioc:Adonis/Lucid/Database';

export default class ClassroomsController {

    protected async get({ auth, response }: HttpContextContract) {
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            const query = await Classroom
                .query()
                .where('professor_id', userData.id)
                .leftJoin('user_classrooms', 'classrooms.id', '=', 'user_classrooms.classroom_id')
                .leftJoin('users', 'user_classrooms.user_id', '=', 'users.id')
                .groupBy('classrooms.id') // Agrupa por ID da sala de aula
                .select(
                    'classrooms.id',
                    'classrooms.professor_id',
                    'classrooms.class_number',
                    'classrooms.student_capacity',
                    'classrooms.avability',
                    'classrooms.created_at',
                    'classrooms.updated_at',
                    Database.raw('GROUP_CONCAT(users.name) as user_names'), // Concatena os nomes dos usuários
                    Database.raw('GROUP_CONCAT(users.email) as user_emails'), // Concatena os emails dos usuários
                    Database.raw('GROUP_CONCAT(users.registration) as user_registrations') // Concatena as matrículas dos usuários
                );

            console.log(query);
            return query;
        } catch (e) {
            console.log(e)
            return response.badGateway({ error: e.message })
        }
    }

    protected async create({ auth, response, request }: HttpContextContract) {
        const bodyRequest = request.all();
        const userData = auth.user;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        try {
            const query = await Classroom.create({
                professor_id: userData.id,
                class_number: bodyRequest.class_number,
                student_capacity: bodyRequest.student_capacity,
            });
            return query;
        } catch (e) {
            return response.badGateway({ e })
        }
    }

    protected async update({ params, response, request }: HttpContextContract) {
        const bodyRequest = request.all();
        const { classroomId } = params;
        try {
            const query = await Classroom
                .query()
                .where('id', classroomId)
                .update(bodyRequest)

            const data = await Classroom.findBy('id', classroomId)
            console.log(query[0])
            if (query[0] == true) {
                return response.ok({
                    message: "Dados atualizados com sucesso!",
                    data
                });
            } else {
                return response.badGateway({ error: "Sala não encontrada." })
            }
        } catch (e) {
            return response.badGateway({ e })
        }
    }



    protected async destroy({ params, response }: HttpContextContract) {
        const { classroomId } = params;

        try {
            const data = await Classroom.findBy('id', classroomId)
            const query: any = await Classroom
                .query()
                .where('id', classroomId)
                .delete()

            if (query[0] == true) {
                return response.ok({
                    message: "Sala deletada com sucesso!",
                    data
                });
            } else {
                return response.badGateway({ error: "Sala não encontrada." })
            }
        } catch (e) {
            return response.badGateway({ e })
        }
    }

    protected async addStudent({ auth, response, params, request }: HttpContextContract) {
        const bodyRequest = request.all();
        const userData = auth.user;
        const { classroomId } = params;

        if (!userData) {
            return response.badRequest("Conta inválida.");
        }

        // const classroomWithUsers = await Classroom.query()
        //     .where('classrooms.id', classroomId)
        //     .preload('userClassrooms', (query) => {
        //         query.select('user_id').from('user_classrooms');
        //     })
        //     .preload('userClassrooms.user')
        //     .first();

        // return classroomWithUsers?.toJSON();

        const query = UserClassroom.create({
            user_id: bodyRequest.user_id,
            classroom_id: classroomId
        })

        return query;

    }
}
