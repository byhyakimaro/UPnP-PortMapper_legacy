const NatAPI = require('nat-api')
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
})
const prefix = '!'

const client = new NatAPI({
  enablePMP: true
})

const commands = [
  {
    name: 'unmapped',
    description: `unmapped ports with UPnP, use (${prefix}unmapped <privatePort> <publicPort> <Protocol>)`,
    run: function (portLocal, portRemote, method) {
      client.unmap({ privatePort: portLocal, publicPort: portRemote, protocol: method}, function (err) {
        if(!err) console.log('\x1b[34m%s\x1b[0m',`Port ${portLocal} unmapped with success!!`)
        runCli()
      })
    }
  },
  {
    name: 'mapped',
    description: `mapped ports with UPnP, use (${prefix}mapped <privatePort> <publicPort> <Protocol>)`,
    run: function (portLocal, portRemote, method) {
      client.map({ privatePort: portLocal, publicPort: portRemote, protocol: method}, function (err) {
        if (err) {
          console.log('\x1b[31m%s\x1b[0m',`Port ${portLocal} already mapped or unavailable!!`)
        } else {
          console.log('\x1b[34m%s\x1b[0m',`Port ${portLocal} mapped with success!!`)
        }
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
      const portLocal = cmd.split(' ')[1]
      const portRemote = cmd.split(' ')[2] || portLocal
      const method = cmd.split(' ')[3] || null
      console.log(portLocal, portRemote, method)
      if(cli && !isNaN(portLocal) && portLocal <= 65000 && portLocal >= 0) {
        cli.run(parseInt(portLocal), parseInt(portRemote), method)
      } 
      else if (!cli) {
        console.log('\x1b[31m%s\x1b[0m',`command invalid use ${prefix}help to see commands`)
        runCli()
      }
      else {
        console.log('\x1b[31m%s\x1b[0m','No port specified')
        runCli()
      } 
    } else {
      console.log('\x1b[33m%s\x1b[0m',`use ${prefix}help`)
      runCli()
    }
  })
}
console.log(`
█████  █████ ███████████             ███████████ 
░░███  ░░███ ░░███░░░░░███           ░░███░░░░░███
 ░███   ░███  ░███    ░███ ████████   ░███    ░███
 ░███   ░███  ░██████████ ░░███░░███  ░██████████ 
 ░███   ░███  ░███░░░░░░   ░███ ░███  ░███░░░░░░  
 ░███   ░███  ░███         ░███ ░███  ░███        
 ░░████████   █████        ████ █████ █████       
  ░░░░░░░░   ░░░░░        ░░░░ ░░░░░ ░░░░░        
                                                      
`)
runCli()