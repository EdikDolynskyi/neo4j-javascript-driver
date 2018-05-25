'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _features = require('./features');

var _features2 = _interopRequireDefault(_features);

var _error = require('../error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2002-2018 "Neo4j,"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var DEFAULT_CONNECTION_TIMEOUT_MILLIS = 5000; // 5 seconds by default

var ChannelConfig =

/**
 * @constructor
 * @param {Url} url the URL for the channel to connect to.
 * @param {object} driverConfig the driver config provided by the user when driver is created.
 * @param {string} connectionErrorCode the default error code to use on connection errors.
 */
function ChannelConfig(url, driverConfig, connectionErrorCode) {
  (0, _classCallCheck3.default)(this, ChannelConfig);

  this.url = url;
  this.encrypted = extractEncrypted(driverConfig);
  this.trust = extractTrust(driverConfig);
  this.trustedCertificates = extractTrustedCertificates(driverConfig);
  this.key = extractClientKey(driverConfig);
  this.cert = extractClientCertificates(driverConfig);
  this.passphrase = extractClientCertificatePassphrase(driverConfig);
  this.knownHostsPath = extractKnownHostsPath(driverConfig);
  this.connectionErrorCode = connectionErrorCode || _error.SERVICE_UNAVAILABLE;
  this.connectionTimeout = extractConnectionTimeout(driverConfig);
};

exports.default = ChannelConfig;


function extractEncrypted(driverConfig) {
  // check if encryption was configured by the user, use explicit null check because we permit boolean value
  var encryptionNotConfigured = driverConfig.encrypted == null;
  // default to using encryption if trust-all-certificates is available
  if (encryptionNotConfigured && (0, _features2.default)('trust_all_certificates')) {
    return true;
  }
  return driverConfig.encrypted;
}

function extractTrust(driverConfig) {
  if (driverConfig.trust) {
    return driverConfig.trust;
  }
  // default to using TRUST_ALL_CERTIFICATES if it is available
  return (0, _features2.default)('trust_all_certificates') ? 'TRUST_ALL_CERTIFICATES' : 'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES';
}

function extractTrustedCertificates(driverConfig) {
  return driverConfig.trustedCertificates || [];
}

function extractClientKey(driverConfig) {
  return driverConfig.key || '';
}

function extractClientCertificates(driverConfig) {
  return driverConfig.cert || '';
}

function extractClientCertificatePassphrase(driverConfig) {
  return driverConfig.passphrase || '';
}

function extractKnownHostsPath(driverConfig) {
  return driverConfig.knownHosts || null;
}

function extractConnectionTimeout(driverConfig) {
  var configuredTimeout = parseInt(driverConfig.connectionTimeout, 10);
  if (configuredTimeout === 0) {
    // timeout explicitly configured to 0
    return null;
  } else if (configuredTimeout && configuredTimeout < 0) {
    // timeout explicitly configured to a negative value
    return null;
  } else if (!configuredTimeout) {
    // timeout not configured, use default value
    return DEFAULT_CONNECTION_TIMEOUT_MILLIS;
  } else {
    // timeout configured, use the provided value
    return configuredTimeout;
  }
}