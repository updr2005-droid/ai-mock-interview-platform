const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.ai-mock-interview.oqlk3t3.mongodb.net",
  (err, records) => {
    console.log(err);
    console.log(records);
  }
);