const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('./config');
const utils = require('./utils');
const connman = require('./connman');

var setup = () => {
    if (process.env.SSID === undefined || process.env.PSK === undefined) {
        console.warn('resin-wifi-env requires the SSID and PSK environment vars to be set. Exiting...');
        return process.exit();
    }
    var data = `
[service_home_ethernet]
Type = ethernet
Nameservers = 8.8.8.8,8.8.4.4

[service_home_wifi]
Type = wifi
Name = ${process.env.SSID}
Passphrase = ${process.env.PSK}
Nameservers = 8.8.8.8,8.8.4.4`;

    console.info(`SSID::'${process.env.SSID}' PSK::'${process.env.PSK}'`);
    utils.durableWriteFile(config.connmanConfig, data).then(() => {
        console.info(`conf file written::${config.connmanConfig}`);
    }).delay(1000)
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