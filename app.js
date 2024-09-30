const FtpSrv = require("ftp-srv");
const path = require("path");
const os = require("os");
const express = require("express");
const app = express()

function getIPv4Address() {
  const networkInterfaces = os.networkInterfaces();
  let ipv4Address = null;

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];

    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        ipv4Address = iface.address;
        break;
      }
    }

    if (ipv4Address) break;
  }

  return ipv4Address;
}

app.get('/',(req,res)=>{
  res.send('works')
})

// Set up FTP server on port 21
const ftpServer = new FtpSrv({
  url: `ftp://${getIPv4Address()}:21`,
  anonymous: true, // Allow anonymous access
  file_format: "ls", // Format of directory listing
});

ftpServer.on("login", ({ connection, username, password }, resolve, reject) => {
  resolve({ root: path.resolve("/") }); // Full access to root directory
});

app.listen(3000,()=>{
  ftpServer.listen().then(() => {
    console.log(`FTP server running...`);
  });
})
