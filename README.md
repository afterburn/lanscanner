[![Downloads](https://img.shields.io/npm/dt/lanscanner.svg)]()
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# LAN Scanner
LAN Scanner is a small network utility for scanning your LAN for in-use MAC/IP addresses. Behind the scenes LAN Scanner makes use of the native arp utility to resolve these MAC/IP addresses.

## Installation
```console
npm install --save lanscanner
```
## Basic usage
```javascript
const LANScanner = require('lanscanner')
LANScanner.scan()
  .then(ips => {
    console.log(ips) // ['192.168.0.22', '192.168.0.24']
  })
```


