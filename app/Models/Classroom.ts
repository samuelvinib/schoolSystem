import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Classroom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teacher_id: number

  @column()
  public class_number: number

  @column()
  public student_capacity: number

  @column()
  public avability: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
