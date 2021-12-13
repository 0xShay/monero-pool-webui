const express = require(`express`);
const fs = require(`fs`);
const fetch = require(`cross-fetch`);
const env = require(`dotenv`).config({ path: '.env' });

const app = express();
console.log(process.env.NODE_BASE_URL);
const port = 3000;

let recentData = {};

fetchData = async (address="83iyvgajvmCSMLeZsEpQUbP3LwxU1zxsGVaTJ2G8n7CBVHQvsHeEYzDKzjXrYjc2HfA6FxLS6Rx2aYZ6WiEzpAHvNHBgGst") => {

    const opts = {
        headers: {
            cookie: `wa=${address}`
        }
    };
    
    let fetchedData = await(await fetch(`http://xmr.shay.services:4243/stats`, opts)).json();
    return fetchedData;

};

updateData = async () => {

    recentData = await fetchData();
    console.log(recentData);

};

updateData()
setInterval(updateData, 60000)

app.use(express.static(__dirname + '/public'));
app.set(`view engine`, `ejs`)

app.get(`/`, (req, res) => {
    res.render(`index`, {
        data: recentData
    });
})

app.listen(port, () => {
    console.log(`UI is live! http://localhost:${port}`);
})