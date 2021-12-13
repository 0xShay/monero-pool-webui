# monero-pool-webui

This is a simple expressjs web UI wrapper for jtgrassie's Monero pool found at https://github.com/jtgrassie/monero-pool - full credit goes to him for the actual pool.

# Setup

1) set up monero node
https://github.com/monero-project/monero#compiling-monero-from-source

2) set up monero-pool
https://github.com/jtgrassie/monero-pool#compiling-from-source

3) clone the repo
`git clone https://github.com/0xShay/monero-pool-webui/ && cd monero-pool-webui`

4) install required modules/dependencies
`npm i`

5) edit .env and add required params
`sudo nano .env`
```
POOL_ENDPOINT=http://127.0.0.1:4243
SSL_KEY_PATH=ssl/cert.pem
SSL_CRT_PATH=ssl/priv.pem
```

6) start the web server (will start at localhost:8080 for http and localhost:443 for https)
`node index.js`

### To-do
- Add graph for pool hashrate
- Add /getting-started page for new miners

Join https://discord.gg/MhTM8CYZX3 for updates!
