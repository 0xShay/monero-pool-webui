const express = require(`express`);
const fs = require(`fs`);
const fetch = require(`cross-fetch`);
const env = require(`dotenv`).config({ path: '.env' });
const http = require(`http`);
const https = require(`https`);

const app = express();
const port = 3000;

let recentData = {};

formatHash = (rawHashes) => {

    /* 1 PH/s is 1,000,000,000,000,000 hashes per second. */
    if ((rawHashes / 1e15) > 1) return `${(rawHashes / 1e15).toFixed(2)} PH/s`;

    /* 1 TH/s is 1,000,000,000,000 hashes per second. */
    if ((rawHashes / 1e12) > 1) return `${(rawHashes / 1e12).toFixed(2)} TH/s`;

    /* 1 GH/s is 1,000,000,000 hashes per second. */
    if ((rawHashes / 1e9) > 1) return `${(rawHashes / 1e9).toFixed(2)} GH/s`;

    /* 1 MH/s is 1,000,000 hashes per second. */
    if ((rawHashes / 1e6) > 1) return `${(rawHashes / 1e6).toFixed(2)} MH/s`;

    /* 1 kH/s is 1,000 hashes per second (sometimes mistakenly written KH/s). */
    if ((rawHashes / 1e3) > 1) return `${(rawHashes / 1e3).toFixed(2)} kH/s`;

    /* 1 H/s is 1 hash per second. */
    return `${(rawHashes).toFixed(2)} H/s`;

};

formatNumber = (num) => {
    if (num.toString().includes(`.`)) {
        let half = num.split(`.`);
        return half[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + `.` + half[1];
    } else {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };
};

isAlphaNumeric = (str) => {
    var code, i, len;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
};

fetchData = async (address="83iyvgajvmCSMLeZsEpQUbP3LwxU1zxsGVaTJ2G8n7CBVHQvsHeEYzDKzjXrYjc2HfA6FxLS6Rx2aYZ6WiEzpAHvNHBgGst") => {

    if (!isAlphaNumeric(address)) {
        address = "83iyvgajvmCSMLeZsEpQUbP3LwxU1zxsGVaTJ2G8n7CBVHQvsHeEYzDKzjXrYjc2HfA6FxLS6Rx2aYZ6WiEzpAHvNHBgGst"
    };

    const opts = {
        headers: {
            cookie: `wa=${address}`
        }
    };
    
    let fetchedData = await(await fetch(`${process.env.POOL_ENDPOINT}/stats`, opts)).json();
    fetchedData["pool_hashrate"] = formatHash(fetchedData["pool_hashrate"]);
    fetchedData["network_hashrate"] = formatHash(fetchedData["network_hashrate"]);
    fetchedData["network_height"] = formatNumber(fetchedData["network_height"]);
    fetchedData["miner_hashrate"] = formatHash(fetchedData["miner_hashrate"]);
    fetchedData["miner_hashrate_stats"][0] = formatHash(fetchedData["miner_hashrate_stats"][0]);
    fetchedData["miner_hashrate_stats"][1] = formatHash(fetchedData["miner_hashrate_stats"][1]);
    fetchedData["miner_hashrate_stats"][2] = formatHash(fetchedData["miner_hashrate_stats"][2]);
    fetchedData["miner_hashrate_stats"][3] = formatHash(fetchedData["miner_hashrate_stats"][3]);
    fetchedData["miner_hashrate_stats"][4] = formatHash(fetchedData["miner_hashrate_stats"][4]);
    fetchedData["miner_hashrate_stats"][5] = formatHash(fetchedData["miner_hashrate_stats"][5]);
    return fetchedData;

};

updateData = async () => {
    recentData = await fetchData();
};

updateData()
setInterval(updateData, 60000)

if (process.env.USE_SSL == "true") {
    const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, `utf8`);
    const certificate = fs.readFileSync(process.env.SSL_CRT_PATH, `utf8`);
    const credentials = {
        key: privateKey,
        cert: certificate
    };
    let httpServer = http.createServer(app);
    let httpsServer = https.createServer(credentials, app);
    httpServer.listen(8080)
    httpsServer.listen(443)
}

app.use(express.static(__dirname + '/public'));
app.set(`view engine`, `ejs`)

app.get(`/`, (req, res) => {
    res.render(`index`, {
        data: recentData
    });
})

app.get(`/stats`, (req, res) => {
    res.render(`index`, {
        data: recentData
    });
})

app.get(`/stats/:address`, async (req, res) => {
    let cxData = await fetchData(req.params["address"]);
    cxData["address"] = req.params["address"];
    res.render(`index`, {
        data: cxData
    });
})

app.listen(port, () => {
    console.log(`UI is live! http://localhost:${port}`);
})