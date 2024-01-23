// database/seeders/UsersSeeder.ts

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UsersSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        name: 'Professor 1',
        email: 'professor1@example.com',
        registration: '12345',
        birthdate: '1990-01-01',
        role: 'professor',
        password: 'senha123',
      },
      {
        name: 'Student 2',
        email: 'student2@example.com',
        registration: '45277',
        birthdate: '1996-02-15',
        role: 'student',
        password: 'senha456',
      },
      {
        name: 'Student 3',
        email: 'student3@example.com',
        registration: '717576',
        birthdate: '1997-05-20',
        role: 'student',
        password: 'senha456',
      },
      {
        name: 'Student 4',
        email: 'student4@example.com',
        registration: '7457676',
        birthdate: '1998-09-10',
        role: 'student',
        password: 'senha456',
      },
      {
        name: 'Student 5',
        email: 'student5@example.com',
        registration: '78876',
        birthdate: '1999-12-25',
        role: 'student',
        password: 'senha456',
      },
      {
        name: 'Student 6',
        email: 'student6@example.com',
        registration: '757757',
        birthdate: '2000-04-30',
        role: 'student',
        password: 'senha456',
      },
    ])
  }
}
