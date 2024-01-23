// database/seeders/UserClassroomsSeeder.ts

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserClassroom from 'App/Models/UserClassroom'

export default class UserClassroomsSeeder extends BaseSeeder {
  public async run () {
    await UserClassroom.createMany([
      {
        user_id: 2, // ID do usuário criado anteriormente
        classroom_id: 1, // ID da sala de aula criada anteriormente
      },
      {
        user_id: 2, // ID do usuário criado anteriormente
        classroom_id: 2, // ID da sala de aula criada anteriormente
      },
      {
        user_id: 2, // ID do usuário criado anteriormente
        classroom_id: 3, // ID da sala de aula criada anteriormente
      },
      // Adicione mais associações entre usuários e salas de aula conforme necessário
    ])
  }
}
