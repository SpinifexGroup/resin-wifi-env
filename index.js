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

    console.info(`SSID set to '${process.env.SSID}'`);
    console.info(`PSK set to '${process.env.PSK}'`);
    utils.durableWriteFile(config.connmanConfig, data).then(() => {
        console.info(`file written to ${config.connmanConfig}...exiting`);
    }).delay(1000)
    .then(()=>{
        connman.waitForConnection(15000)
    })
    .then(()=>{
        console.info('connected!')
    })
    .then(()=>{
        utils.durableWriteFile(config.persistentConfig, data)
    })
    .then(()=>{
        console.info('config complete, exiting...');
        process.exit();
    }).catch((e)=>{
        console.log('error writing file', e);
    })
};

setup();