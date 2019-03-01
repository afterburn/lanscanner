const spawn = require('cross-spawn')
const os = require('os')

const uniq = (arr, key) => {
  const seen = {}
  const out = []
  const len = arr.length
  let j = 0
  for(let i = 0; i < len; i++) {
    const item = arr[i]
    if(seen[item] !== 1) {
      seen[item] = 1
      out[j++] = item
    }
  }
  return out
}

class LANScanner {
  static async mdns () {
    try {
      const result = []
      const baseIps = await LANScanner.getBaseIps()
      baseIps.forEach(baseIp => {
        for (let i=0;i<=255;i++) {
          const targetIp = baseIp + i
          result.push(targetIp)
        }
      })
      return result
    } catch (ex) {
      throw new Error(ex)
    }
  }

  static arp () {
    return new Promise((resolve, reject) => {
      const p = spawn('arp', ['-a'])
      p.stdout.on('data', buf => {
        resolve(buf.toString().trim())
        p.kill()
      })
    })
  }

  static async getBaseIps () {
    try {
      const result = []
      const ips = await LANScanner.scan()
      for (let i=0;i<ips.length;i++) {
        const ip = ips[i]
        const base = ip.split('.').slice(0, 3).join('.') + '.'
        if (result.indexOf(base) === -1) {
          result.push(base)
        }
      }
      return result
    } catch (ex) {
      throw new Error(ex)
    }
  }

  static async scan (type = 'default') {
    try {
      const arp = await LANScanner.arp()
      switch (type) {
        case 'ip': {
          return uniq(LANScanner.getIPsFromString(arp))
        }
        case 'mac': {
          return uniq(LANScanner.getMACsFromString(arp))
        }
        default: {
          return LANScanner.getIPsAndMACsFromString(arp)
        }
      }
    } catch (ex) {
      throw new Error(ex)
    }
  }

  static getIPsFromString (input) {
    return input.match(/([0-9]+(\.|)){4}/g)
  }

  static getMACsFromString (input) {
    return input.match(/([0-9a-f]+(\:|)){6}/g)
  }

  static getIPsAndMACsFromString (input) {
    return input.split('\n')
      .map(entry => {
        const ip = LANScanner.getIPsFromString(entry)[0]
        const mac = LANScanner.getMACsFromString(entry)[0]
        return { ip, mac }
      })
  }

  static getInternalIP () {
    const ifaces = os.networkInterfaces()
    let result
    Object.keys(ifaces).forEach((ifname) => {
      let alias = 0
      ifaces[ifname].forEach((iface) => {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return
        }
        if (alias >= 1) {
          result = iface.address
        } else {
          result = iface.address
        }
        ++alias
      })
    })
    return result
  }
}

module.exports = LANScanner