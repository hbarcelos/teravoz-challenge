import restify from 'restify'
import { reducer } from './calls'

const server = restify.createServer()

server.use(restify.plugins.bodyParser())

server.post('/webhook', async (req, res) => {
  res.json(await reducer(req.body))
})

export default server
