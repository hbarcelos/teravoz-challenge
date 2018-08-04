import server from './server'

const port = process.env.SERVER_PORT || 3001

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`)
})
