module.exports = {
    ssid: process.env.PORTAL_SSID || 'ResinAP',
    passphrase: process.env.PORTAL_PASSPHRASE,
    iface: process.env.PORTAL_INTERFACE || 'wlan0',
    gateway: process.env.PORTAL_GATEWAY || '192.168.42.1',
    dhcpRange: process.env.PORTAL_DHCP_RANGE || '192.168.42.2,192.168.42.254',
    connmanConfig: process.env.PORTAL_CONNMAN_CONFIG || '/host/var/lib/connman/network.config',
    persistentConfig: process.env.PORTAL_PERSISTENT_CONFIG || '/data/network.config'
};