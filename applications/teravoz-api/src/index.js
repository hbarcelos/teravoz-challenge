import { generate as generateCalls } from './calls'
import { randomTimeout } from './timer'
import webhookProducer from './webhook-producer'
import server from './server'

const callEvents$ = generateCalls({
  interval: () => randomTimeout(5000, 2000),
  durationFactor: () => randomTimeout(100)
})

webhookProducer(callEvents$)

server.listen(3000, () => {
  console.log('Server is listening on http://localhost:3000')
})
