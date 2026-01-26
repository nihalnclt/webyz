import { FastifyInstance } from 'fastify'

export default async function (fastify: FastifyInstance) {
  fastify.get('/', () => {
    return {
      message:
        `Hello /documentation`
    }
  })
}