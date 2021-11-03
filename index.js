const NatAPI = require('nat-api')

const client = new NatAPI({
  autoUpdate: true,
  enablePMP: true
})

const port = 3000

// Map public port 1000 to private port 1000 with UDP and TCP
client.map(port, function (err) {
  if (err) return console.log('Error', err)
  console.log(`${port} mapped with success!!`)
})
