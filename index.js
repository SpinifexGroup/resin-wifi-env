const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./config');
const utils = require('./utils');
const connman = require('./connman');

var setup = () => {
    if(process.env.WIFI === undefined || process.env.WIFI.length < 1){
        console.warn('resin-wifi-env requires the WIFI env var to be set with "SSID|PSK". Exiting...');
        return process.exit();
    }
    var creds = process.env.WIFI.split('|');
    var ssid = creds[0];
    var psk = creds[1];
    var data = `
[service_home_ethernet]
Type = ethernet
Nameservers = 8.8.8.8,8.8.4.4

[service_home_wifi]
Type = wifi
Name = ${ssid}
Passphrase = ${psk}
Nameservers = 8.8.8.8,8.8.4.4`;

    console.info(`SSID::'${ssid}' PSK::'${psk}'`);
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
        }).catch((e)=>{
        console.log('error writing file', e);
    })
};

setup();