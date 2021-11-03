const NatAPI = require('nat-api')
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})
const prefix = '!'

const client = new NatAPI({
  autoUpdate: true,
  enablePMP: true
})

const commands = [
  {
    name: 'close',
    run: function (port) {
      client.unmap(port, function (err) {
        if(!err) console.log(`Port ${port} closed with success!!`)
        runCli()
      })
    }
  },
  {
    name: 'open',
    run: function (port) {
      client.map({ publicPort: port, privatePort: port }, function (err) {
        if (err) return console.log('Error', err)
        console.log(`Port ${port} mapped with success!!`)
        runCli()
      })
    }
  }
]

async function runCli() { 
  await new Promise(resolve => setTimeout(resolve, 100))
  
  readline.question("root@UPnP:~$ ", (cmd) => {
    if (cmd.startsWith(prefix)) {
      const cli = commands.find(({ name }) => name === cmd.split(' ')[0].split('!')[1].toLowerCase())
      const port = cmd.split(' ')[1]
      if(cli && port) {
        cli.run(parseInt(port))
      } 
      else if (!port) {
        console.log('No port specified')
        runCli()
      }
      else {
        console.log('command invalid')
        runCli()
      } 
    } else {
      console.log(`prefix is ${prefix}`)
      runCli()
    }
  })
}

runCli()