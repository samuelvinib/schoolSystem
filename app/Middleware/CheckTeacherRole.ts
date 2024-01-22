import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckTeacherRole {
  public async handle({ auth, response}: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.authenticate()

    // Verifica se o usuário tem a role "teacher"
    if (user.role !== 'teacher') {
      return response.forbidden({
        message:'Acesso negado. Somente professores têm permissão para acessar esta rota.'
      })
    }

    // Passa para o próximo middleware
    await next()
  }
}
