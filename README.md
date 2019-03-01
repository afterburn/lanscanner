[![Downloads](https://img.shields.io/npm/dt/lanscanner.svg)]()
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# LAN Scanner
LAN Scanner is a small network utility for scanning your LAN for in use MAC/IP addresses. Behind the scenes LAN Scanner makes use of the native arp utility to resolve these MAC/IP addresses.

## Installation
```console
npm install --save lanscanner
```
## Basic usage
```javascript
const LANScanner = require('lanscanner')
LANScanner.scan()
  .then((result) => {
    console.log(result)
    // [
    //   { ip: '192.168.0.22', mac: 'ac:87:a3:2b:e2:ca' },
    //   { ip: '192.168.0.24', mac: 'ac:87:a3:2b:e2:ca' }
    // ]
  })
```
## Documentation
#### .scan()
Scans your local area network to retrieve a list of in use IP and/or MAC addresses.
Returns an object containing a list of IP and/or MAC addresses after the Promise has been fulfilled.
```javascript
LANScanner.scan()
  .then((result) => {
    console.log(result)
    // [
    //   { ip: '192.168.0.22', mac: 'ac:87:a3:2b:e2:ca' },
    //   { ip: '192.168.0.24', mac: 'ac:87:a3:2b:e2:ca' }
    // ]
  })
```

If you just want to retrieve a list of in use ip addresses **or** mac address you can give this function an argument.
```javascript
LANScanner.scan('ip')
    .then((result) => {
        console.log(result)
        // ['192.168.0.22', '192.168.0.24']
    })

LANScanner.scan('mac')
    .then((result) => {
        console.log(result)
        // ['ac:87:a3:2b:e2:ca', 'ac:87:a3:2b:e2:ca']
    })
```
**Note** If you use an argument in the .scan() function you will automatically only get unique values back. This is disabled for when you scan for both IP and MAC addresses.
So .scan() without an argument could have duplicate IP and/or MAC address because one MAC address might have 2 IP addresses.

#### .getInternalIP()
Gets the internal ip address of the current machine.
```javascript
const internalIP = LANScanner.getInternalIP()
console.log(internalIP) // '192.168.0.22'
```

#### .arp()
Executes the ```arp -a``` command and will return the raw result as a string after the Promise has been fulfilled.
```javascript
LANScanner.arp()
  .then((result) => {
    // Example output:
    // ? (192.168.0.22) at ac:87:a3:2b:e2:ca on en0 ifscope [ethernet]
    // ? (192.168.0.22) at ac:87:a3:2b:e2:ca on en1 ifscope [ethernet]
    // ? (192.168.0.24) at c8:3c:85:34:7f:be on en0 ifscope [ethernet]
    // ? (192.168.0.24) at c8:3c:85:34:7f:be on en1 ifscope [ethernet]
  })
```

#### .mdns()
Returns a list of all possible ip addresses within the local area networks base ips found within the arp table.
```javascript
LANScanner.mdns()
  .then(ips => {
      console.log(ips)
      // ['192.168.0.1', ..., '192.168.0.255', '192.168.1.1', ..., '192.168.1.255']
  })
```