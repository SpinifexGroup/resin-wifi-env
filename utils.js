const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const constants = require('constants');
const path = require('path');

module.exports.durableWriteFile = (file, data) => {
    return fs.writeFileAsync(file + '.tmp', data).then(() => {
        return fs.openAsync(file + '.tmp', 'r');
    }).tap(fs.fsyncAsync).then(fs.closeAsync).then(() => {
        return fs.renameAsync(file + '.tmp', file);
    }).then(() => {
        return fs.openAsync(path.dirname(file), 'r', constants.O_DIRECTORY);
    }).tap(fs.fsyncAsync).then(fs.closeAsync);
};