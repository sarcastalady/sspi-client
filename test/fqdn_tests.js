'use strict';

const fs = require('fs');
const os = require('os');

const Fqdn = require('../src_js/index.js').Fqdn;

function getLocalhostFqdnPattern() {
  const localhostFqdn = JSON.parse(fs.readFileSync(
    os.homedir() + '/.sspi-client/test_config.json', 'utf8')).localhostFqdn;
  return new RegExp("^" + localhostFqdn + "$");
}

function getLocalhostName() {
  return JSON.parse(fs.readFileSync(
    os.homedir() + '/.sspi-client/test_config.json', 'utf8')).localhostName;
}

function fqdnTestSuccessImpl(test, hostidentifier, expectedFqdnPattern) {
  Fqdn.getFqdn(hostidentifier, (err, fqdn) => {
    test.strictEqual(err, null);
    test.notStrictEqual(fqdn.match(expectedFqdnPattern), null,
      'host: ' + hostidentifier + ', fqdn: ' + fqdn + ', patten: ' + expectedFqdnPattern);
    test.done();
  });
}

exports.loopbackIpAddress = function(test) {
  fqdnTestSuccessImpl(test, '127.0.0.1', getLocalhostFqdnPattern());
}

exports.ipv4Address = function (test) {
  const facebookIpv4 = '31.13.77.36';
  fqdnTestSuccessImpl(test, facebookIpv4, /^.*\.facebook.com$/);
}

exports.ipv6Address = function (test) {
  const facebookIpv6 = '2a03:2880:f127:83:face:b00c:0:25de';
  fqdnTestSuccessImpl(test, facebookIpv6, /^.*\.facebook.com$/);
}

exports.simpleHostname = function(test) {
  fqdnTestSuccessImpl(test, getLocalhostName(), getLocalhostFqdnPattern());
}

exports.localhostLowerCase = function(test) {
  fqdnTestSuccessImpl(test, 'localhost', getLocalhostFqdnPattern());
}

exports.localhostUpperCase = function(test) {
  fqdnTestSuccessImpl(test, 'LOCALHOST', getLocalhostFqdnPattern());
}

exports.localhostMixedCase = function(test) {
  fqdnTestSuccessImpl(test, 'LoCaLhOsT', getLocalhostFqdnPattern());
}

exports.hostFqdn = function (test) {
  fqdnTestSuccessImpl(test, 'abc.example.com', /^abc.example.com$/);
}

exports.invalidIpaddress = function (test) {
  Fqdn.getFqdn('1.1.1.1', (err, fqdn) => {
    test.notStrictEqual(err, null, 'fqdn: ', + fqdn);
    test.done();
  });
}

exports.invalidHostname = function (test) {
  Fqdn.getFqdn('non-existent', (err, fqdn) => {
    test.notStrictEqual(err, null, 'fqdn: ', + fqdn);
    test.done();
  });
}
