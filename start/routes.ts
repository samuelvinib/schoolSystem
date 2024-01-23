import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

Route.group(() => {

    // Rota de saúde
    Route.get('health', async ({ response }) => {
        const report = await HealthCheck.getReport();

        return report.healthy
            ? response.ok(report)
            : response.badRequest(report);
    });

    // Rotas de autenticação
    Route.any('/register', 'AuthController.register');
    Route.any('/login', 'AuthController.login');

    // Rotas protegidas por autenticação
    Route.group(() => {
        Route.get('/classroom', 'UsersController.showAllClassrooms');
        Route.get('/user', 'UsersController.show');
        Route.put('/user', 'UsersController.update');
        Route.delete('/user', 'UsersController.destroy');
    }).middleware('auth');

    // Rotas para professores
    Route.group(() => {
        Route.get('/classroom', 'ClassroomsController.getAllClassrooms');
        Route.post('/classroom', 'ClassroomsController.create');
        Route.put('/classroom/:classroomId', 'ClassroomsController.update');
        Route.delete('/classroom/:classroomId', 'ClassroomsController.destroy');
        Route.group(() => {
            Route.get('/students', 'UsersController.showAllUsers');
            Route.post('/:classroomId/students/:studentsId', 'ClassroomsController.addStudent');
            Route.delete('/:classroomId/students/:studentsId', 'ClassroomsController.removeStudent');
        }).prefix('/classroom');
    }).prefix('/professor').middleware(['auth', 'isProfessor']);
})
    .prefix('/api');
