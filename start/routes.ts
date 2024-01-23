/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {

    Route.get('health', async ({ response }) => {
        const report = await HealthCheck.getReport()

        return report.healthy
            ? response.ok(report)
            : response.badRequest(report)
    })

    Route.any('/register', 'AuthController.register');
    Route.any('/login', 'AuthController.login');

    Route.group(()=>{
        Route.get('/classroom', 'UsersController.showAllClassrooms' );
        Route.get('/user', 'UsersController.show' );
        Route.put('/user', 'UsersController.update' );
        Route.delete('/user', 'UsersController.destroy' );
    }).middleware('auth')

    Route.group(()=>{
        Route.get('/classroom', 'ClassroomsController.getAllClassrooms' );
        Route.post('/classroom', 'ClassroomsController.create' );
        Route.put('/classroom/:classroomId', 'ClassroomsController.update' );
        Route.delete('/classroom/:classroomId', 'ClassroomsController.destroy' );
        Route.group(()=>{
            Route.get('/students', 'UsersController.showAllUsers' );
            Route.post('/:classroomId/students/:studentsId', 'ClassroomsController.addStudent' );
            Route.delete('/:classroomId/students/:studentsId', 'ClassroomsController.removeStudent' );
        }).prefix('/classroom')
    }).prefix('/professor').middleware(['auth', 'isProfessor'])

})
    .prefix('/api')
