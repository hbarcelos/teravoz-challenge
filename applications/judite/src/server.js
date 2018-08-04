import restify from 'restify'
import { redirect } from './calls'

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

server.post('/webhook', async (req, res) => {
  res.json(await redirect(req.body))
})

export default server
