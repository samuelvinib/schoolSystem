import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Database from '@ioc:Adonis/Lucid/Database';
import Classroom from 'App/Models/Classroom';
import UserClassroom from 'App/Models/UserClassroom';

interface ClassroomResponse {
  classroom_id: number;
  classroom_number: number;
  student_capacity: number;
  availability: boolean;
  professor_name: string;
  students: {
    user_id: number;
    user_name: string;
    user_email: string;
    user_registration: string;
  }[];
}

export default class ClassroomsController {
  protected async getAllClassrooms({ auth, response }: HttpContextContract) {
    const userData = auth.user;

    if (!userData) {
      return response.badRequest("Conta inválida.");
    }

    try {
      const query = await Database
        .query()
        .from('classrooms as c')
        .where('professor_id', userData.id)
        .leftJoin('user_classrooms as uc', 'uc.classroom_id', '=', 'c.id')
        .leftJoin('users as u', 'u.id', '=', 'uc.user_id')
        .leftJoin('users as professor', 'professor.id', '=', 'c.professor_id')
        .select(
          'c.id as classroom_id',
          'c.class_number as classroom_number',
          'c.student_capacity as student_capacity',
          'c.availability as availability',
          'professor.name as professor_name',
          'u.id as user_id',
          'u.name as user_name',
          'u.email as user_email',
          'u.registration as user_registration'
        )
        .groupBy('c.id', 'u.id');

      const classrooms: ClassroomResponse[] = query.reduce((result, row) => {
        const existingClassroom = result.find(c => c.classroom_id === row.classroom_id);
        if (existingClassroom) {
          if (row.user_id !== null) {
            existingClassroom.students.push({
              user_id: row.user_id,
              user_name: row.user_name,
              user_email: row.user_email,
              user_registration: row.user_registration,
            });
          }
        } else {
          result.push({
            classroom_id: row.classroom_id,
            classroom_number: row.classroom_number,
            student_capacity: row.student_capacity,
            availability: row.availability,
            professor_name: row.professor_name,
            students: row.user_id !== null ? [{
              user_id: row.user_id,
              user_name: row.user_name,
              user_email: row.user_email,
              user_registration: row.user_registration,
            }] : [],
          });
        }
        return result;
      }, []);

      return classrooms;
    } catch (e) {
      console.error(e);
      return response.badGateway({ error: e.message });
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
      return response.badGateway({ e });
    }
  }

  protected async update({ params, response, request, auth }: HttpContextContract) {
    const userData = auth.user;
    const bodyRequest = request.all();

    if (!userData) {
        return response.badRequest("Conta inválida.");
      }
      
    const { classroomId } = params;
    try {
      const query = await Classroom
        .query()
        .where('id', classroomId)
        .where('professor_id',userData.id )
        .update(bodyRequest);

      const data = await Classroom.findBy('id', classroomId);
      console.log(query[0]);
      if (query[0] == true) {
        return response.ok({
          message: "Dados atualizados com sucesso!",
          data,
        });
      } else {
        return response.badGateway({ error: "Sala não encontrada." });
      }
    } catch (e) {
      return response.badGateway({ e });
    }
  }

  protected async destroy({ params, response }: HttpContextContract) {
    const { classroomId } = params;

    try {
      const data = await Classroom.findBy('id', classroomId);
      const query: any = await Classroom
        .query()
        .where('id', classroomId)
        .delete();

      if (query[0] == true) {
        return response.ok({
          message: "Sala deletada com sucesso!",
          data,
        });
      } else {
        return response.badGateway({ error: "Sala não encontrada." });
      }
    } catch (e) {
      return response.badGateway({ e });
    }
  }

  protected async addStudent({ auth, response, params }: HttpContextContract) {
    const userData = auth.user;
    const { classroomId, studentsId } = params;

    if (!userData) {
      return response.badRequest("Conta inválida.");
    }

    try {
      const existingUserClassroom = await this.checkIfUserIsInClassroom(studentsId, classroomId);

      if (existingUserClassroom) {
        return response.badRequest({
          error: "Este estudante já está associado a esta sala de aula.",
        });
      }

      const classroom = await this.checkClassroomAvailabilityAndCapacity(classroomId);

      // Criar o registro na tabela user_classrooms
      const query = await UserClassroom.create({
        user_id: studentsId,
        classroom_id: classroomId,
      });

      return query;
    } catch (e) {
        if(e.message === 'E_ROW_NOT_FOUND: Row not found'){
            return response.badGateway({error:'Aluno ou sala inválida.'})
        }
      return this.handleErrors(response, e);
    }
  }

  protected async removeStudent({ auth, response, params }: HttpContextContract) {
    const userData = auth.user;
    const { classroomId, studentsId } = params;

    if (!userData) {
      return response.badRequest("Conta inválida.");
    }

    if (classroomId == undefined || studentsId == undefined) {
      return response.badGateway({ error: "Insira parâmetros válidos" });
    }

    try {
      const existingUserClassroom = await this.checkIfUserIsInClassroom(studentsId, classroomId);

      if (!existingUserClassroom) {
        return response.badRequest({
          error: "Aluno ou sala inválida.",
        });
      }

      // Remover o registro da tabela user_classrooms
      await existingUserClassroom.delete();

      return response.ok({
        message: "Estudante removido da sala com sucesso.",
      });
    } catch (e) {
      return this.handleErrors(response, e);
    }
  }

  private async checkIfUserIsInClassroom(userId: number, classroomId: number) {
    return await UserClassroom
      .query()
      .where('user_id', userId)
      .where('classroom_id', classroomId)
      .first();
  }

  private async checkClassroomAvailabilityAndCapacity(classroomId: number) {
    const classroom = await Classroom.findOrFail(classroomId);
    const currentStudentCount = await Database
      .from('user_classrooms')
      .where('classroom_id', classroomId)
      .count('*', 'total');

    if (currentStudentCount[0].total >= classroom.student_capacity) {
      throw new Error("A capacidade máxima de estudantes nesta sala de aula foi atingida.");
    }

    if (classroom.availability === false) {
      throw new Error("A sala não está disponível para alocar alunos.");
    }

    return classroom;
  }

  private handleErrors(response: any, error: any) {
    if (error['code'] === 'ER_NO_REFERENCED_ROW_2') {
      return response.badGateway({
        error: 'Por favor, insira um aluno válido.',
      });
    }
    return response.badGateway({ error: error.message });
  }
}
