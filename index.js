const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./config');
const utils = require('./utils');
const connman = require('./connman');

var setup = () => {
    var creds, ssid, psk;
    // if NO WIFI env var, reject immediately and exit
    if(process.env.WIFI === undefined || process.env.WIFI.length < 1){
        console.warn('resin-wifi-env requires the WIFI env var to be set with "SSID|PSK". Exiting...');
        return process.exit();
    // if SSID and PSK var, check for length and set those variables appropriately
    } else if(process.env.SSID !== undefined && process.env.PSK !== undefined && process.env.SSID.length > 0 && process.env.PSK.length > 0){
        ssid = process.env.SSID;
        psk = process.env.PSK;
    // if WIFI var only, check for type, check for length, check for split character, and then assign
    } else if (process.env.WIFI !== undefined && process.env.WIFI.length > 0 && process.env.WIFI.indexOf("|")>-1){
        creds = process.env.WIFI.split('|');
        ssid = creds[0];
        psk = creds[1];
    }
    var data = `
[service_home_ethernet]
Type = ethernet
Nameservers = 8.8.8.8,8.8.4.4

[service_home_wifi]
Type = wifi
Name = ${ssid}
Passphrase = ${psk}
Nameservers = 8.8.8.8,8.8.4.4`;

    console.info(`ACTIVATED SSID::'${ssid}' PSK::'${psk}'`);
    utils.durableWriteFile(config.connmanConfig, data).then(() => {
        console.info(`conf file written::${config.connmanConfig}`);
    })
    .delay(1000)
    .then(()=>{
        connman.waitForConnection(15000)
    })
    .then(()=>{
        console.info('connman connected!')
    })
    .then(()=>{
        console.info(`writing to persistent config::${config.persistentConfig}`);
        utils.durableWriteFile(config.persistentConfig, data)
    })
    .then(()=>{
        console.info('wifi config complete, exiting...');
        process.exit();
    })
    .catch((e)=>{
        console.log('error writing file', e);
    })
};

setup();