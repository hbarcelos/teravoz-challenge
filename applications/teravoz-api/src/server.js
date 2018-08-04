import restify from 'restify'
import { delegate } from './actions'

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

server.post('/action', async (req, res) => {
  res.json(await delegate(req.body))
})

export default server
