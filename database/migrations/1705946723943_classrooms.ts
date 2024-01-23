import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'classrooms'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('professor_id').unsigned().references('users.id').onDelete('CASCADE');
      table.integer('class_number').notNullable();
      table.integer('student_capacity').notNullable();
      table.boolean('availability').defaultTo(true);

      table.dateTime('created_at', { useTz: true }).notNullable();
      table.dateTime('updated_at', { useTz: true }).notNullable();
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
