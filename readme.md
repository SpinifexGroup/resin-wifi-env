## resin-wifi-env

[![dependencies](https://david-dm.org/spinifexgroup/resin-wifi-env.svg) ](https://david-dm.org/)

[WIP]

Wifi configuration via simple environment variables from the Resin.io admin portal.

This module accepts the following environment variable:

`WIFI` : [SSID]|[PSK]
`WIFI` : my_wireless_access_point|my_password

The environment variable above *heavily* relies on the '|' character to split the pair apart. This is done to prevent restarting the Resin device Docker container from starting twice, as a single environment variable change will trigger an application restart.

This module borrows very heavily from the [resin wifi connect](https://github.com/resin-io/resin-wifi-connect) project for dbus and connman status changes


TODO    
* Integration docs
* Tests
