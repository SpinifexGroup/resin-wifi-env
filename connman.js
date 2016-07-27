const Promise = require('bluebird');
const DBus = require('./dbus-promise');
const dbus = new DBus();
const bus = dbus.getBus('system');
const SERVICE = 'net.connman';
const WIFI_OBJECT = '/net/connman/technology/wifi';
const TECHNOLOGY_INTERFACE = 'net.connman.Technology';

exports.waitForConnection = (timeout) => {
    console.log('waiting for connman to connect..');
    return bus.getInterfaceAsync(SERVICE, WIFI_OBJECT, TECHNOLOGY_INTERFACE).then((wifi) => {
        return new Promise((resolve, reject) => {
            var handler;
            handler = (name, value) => {
                if (name === 'Connected' && value === true) {
                    wifi.removeListener('PropertyChanged', handler);
                    return resolve();
                }
            };
            wifi.on('PropertyChanged', handler);
            wifi.GetPropertiesAsync().then((arg) => {
                var Connected;
                Connected = arg.Connected;
                if (Connected) {
                    wifi.removeListener('PropertyChanged', handler);
                    return resolve();
                }
            });
            return setTimeout(() => {
                wifi.removeListener('PropertyChanged', handler);
                return reject();
            }, timeout);
        });
    });
};