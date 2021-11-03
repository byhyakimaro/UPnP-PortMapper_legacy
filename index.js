const NatAPI = require('nat-api')

const client = new NatAPI({
  autoUpdate: true,
  enablePMP: true
})
const port = 4444

client.unmap(port, function (err) {
  if(!err) console.log('Port unmapped!') 
})

client.map({ publicPort: port, privatePort: port }, function (err) {
  if (err) return console.log('Error', err)
  console.log(`Port ${port} mapped with success!!`)
})
