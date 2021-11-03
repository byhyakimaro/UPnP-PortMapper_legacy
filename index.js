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
        if(!err) console.log('\x1b[34m%s\x1b[0m',`Port ${port} closed with success!!`)
        runCli()
      })
    }
  },
  {
    name: 'open',
    run: function (port) {
      client.map({ publicPort: port, privatePort: port }, function (err) {
        if (err) return console.log('Error', err)
        console.log('\x1b[34m%s\x1b[0m',`Port ${port} mapped with success!!`)
        runCli()
      })
    }
  }
]

async function runCli() { 
  await new Promise(resolve => setTimeout(resolve, 100))
  const user = 'root@UPnP:~$'
  readline.question(`\x1b[1m${user}\x1b[0m `, (cmd) => {
    if (cmd.startsWith(prefix)) {
      const cli = commands.find(({ name }) => name === cmd.split(' ')[0].split('!')[1].toLowerCase())
      const port = cmd.split(' ')[1]
      if(cli && port) {
        cli.run(parseInt(port))
      } 
      else if (!cli) {
        console.log('\x1b[31m%s\x1b[0m','command invalid')
        runCli()
      }
      else if (!port) {
        console.log('\x1b[31m%s\x1b[0m','No port specified')
        runCli()
      } 
    } else {
      console.log('\x1b[36m%s\x1b[0m',`prefix is ${prefix}`)
      runCli()
    }
  })
}

runCli()