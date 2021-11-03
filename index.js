const NatAPI = require('nat-api')

const client = new NatAPI({
  autoUpdate: true,
  enablePMP: true
})

const port = 3000

client.map({ publicPort: port, privatePort: port }, function (err) {
  if (err) return console.log('Error', err)
  console.log(`${port} mapped with success!!`)
})

client.destroy()
