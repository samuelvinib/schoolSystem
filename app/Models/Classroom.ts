import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

/**
* @swagger
* components:
*   schemas:
*     Classroom:
*       type: object
*       properties:
*         id:
*           type: integer
*         professor_id:
*           type: integer
*         class_number:
*           type: integer
*         student_capacity:
*           type: integer
*         availability:
*           type: boolean
*         createdAt:
*           type: string
*           format: date-time
*         updatedAt:
*           type: string
*           format: date-time
*/
export default class Classroom extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public professor_id: number

  @column()
  public class_number: number

  @column()
  public student_capacity: number

  @column()
  public availability: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
