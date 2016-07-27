(function() {
    var DBus, Promise, SERVICE, TECHNOLOGY_INTERFACE, WIFI_OBJECT, bus, dbus;

    Promise = require('bluebird');

    DBus = require('./dbus-promise');

    dbus = new DBus();

    bus = dbus.getBus('system');

    SERVICE = 'net.connman';

    WIFI_OBJECT = '/net/connman/technology/wifi';

    TECHNOLOGY_INTERFACE = 'net.connman.Technology';

    exports.waitForConnection = function(timeout) {
        console.log('Waiting for connman to connect..');
        return bus.getInterfaceAsync(SERVICE, WIFI_OBJECT, TECHNOLOGY_INTERFACE).then(function(wifi) {
            return new Promise(function(resolve, reject, onCancel) {
                var handler;
                handler = function(name, value) {
                    if (name === 'Connected' && value === true) {
                        wifi.removeListener('PropertyChanged', handler);
                        return resolve();
                    }
                };
                wifi.on('PropertyChanged', handler);
                wifi.GetPropertiesAsync().then(function(arg) {
                    var Connected;
                    Connected = arg.Connected;
                    if (Connected) {
                        wifi.removeListener('PropertyChanged', handler);
                        return resolve();
                    }
                });
                return setTimeout(function() {
                    wifi.removeListener('PropertyChanged', handler);
                    return reject();
                }, timeout);
            });
        });
    };

}).call(this);