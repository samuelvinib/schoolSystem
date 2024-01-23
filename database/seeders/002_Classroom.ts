// database/seeders/ClassroomsSeeder.ts

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Classroom from 'App/Models/Classroom'

export default class ClassroomsSeeder extends BaseSeeder {
  public async run () {
    await Classroom.createMany([
      {
        professor_id: 1, // ID do professor criado anteriormente
        class_number: 1,
        student_capacity: 30,
        availability: true,
      },
      {
        professor_id: 1, // ID do professor criado anteriormente
        class_number: 5,
        student_capacity: 15,
        availability: true,
      },
      {
        professor_id: 1, // ID do professor criado anteriormente
        class_number: 11,
        student_capacity: 7,
        availability: true,
      },
    ])
  }
}
