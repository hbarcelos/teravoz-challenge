import { generate as generateCalls } from './calls'
import { randomTimeout } from './timer'
import webhookProducer from './webhook-producer'
import server from './server'

const callEvents$ = generateCalls({
  interval: () => randomTimeout(5000, 2000),
  durationFactor: () => randomTimeout(100)
})

webhookProducer(callEvents$)

const port = process.env.SERVER_PORT || 3000
server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
