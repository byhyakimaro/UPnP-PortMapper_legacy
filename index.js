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
    name: 'unmapped',
    description: `unmapped ports with UPnP, use (${prefix}unmapped 3000)`,
    run: function (port) {
      client.unmap(port, function (err) {
        if(!err) console.log('\x1b[34m%s\x1b[0m',`Port ${port} unmapped with success!!`)
        runCli()
      })
    }
  },
  {
    name: 'mapped',
    description: `mapped ports with UPnP, use (${prefix}mapped 3000)`,
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
  readline.question(`\x1b[32m${user}\x1b[0m `, (cmd) => {
    if (cmd.startsWith(prefix)) {
      if (cmd.split(prefix)[1] === 'help') {
        commands.forEach(element => {
          console.log('\x1b[36m%s\x1b[0m','--------------------------------------')
          console.log('\x1b[36m%s\x1b[0m','command:',`${prefix}${element.name}`)
          console.log('\x1b[36m%s\x1b[0m','description:', element.description)
          console.log('\x1b[36m%s\x1b[0m','--------------------------------------')
        });
        return runCli()
      }
      const cli = commands.find(({ name }) => name === cmd.split(' ')[0].split(prefix)[1].toLowerCase())
      const port = cmd.split(' ')[1]
      if(cli && !isNaN(port) && port <= 65000 && port >= 0) {
        cli.run(parseInt(port))
      } 
      else if (!cli) {
        console.log('\x1b[31m%s\x1b[0m','command invalid')
        runCli()
      }
      else {
        console.log('\x1b[31m%s\x1b[0m','No port specified')
        runCli()
      } 
    } else {
      console.log('\x1b[33m%s\x1b[0m',`prefix is ${prefix}`)
      runCli()
    }
  })
}

runCli()