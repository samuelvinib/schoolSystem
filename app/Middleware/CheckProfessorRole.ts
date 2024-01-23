import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckProfessorRole {
  public async handle({ auth, response}: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.authenticate()

    // Verifica se o usuário tem a role "professor"
    if (user.role !== 'professor') {
      return response.forbidden({
        message:'Acesso negado. Somente professores têm permissão para acessar esta rota.'
      })
    }

    // Passa para o próximo middleware
    await next()
  }
}
