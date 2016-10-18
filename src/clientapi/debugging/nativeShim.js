/**
 * @license
 * This file is part of the Game Closure SDK.
 *
 * The Game Closure SDK is free software: you can redistribute it and/or modify
 * it under the terms of the Mozilla Public License v. 2.0 as published by Mozilla.

 * The Game Closure SDK is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * Mozilla Public License v. 2.0 for more details.

 * You should have received a copy of the Mozilla Public License v. 2.0
 * along with the Game Closure SDK.  If not, see <http://mozilla.org/MPL/2.0/>.
 */
import PubSub from 'lib/PubSub';
import Callback from 'lib/Callback';

exports.isShim = true;
exports.backButton = new PubSub();
exports.dialogs = {
  showDialog: function () {
    logger.log('Showing a dialog!');
  },
  showAppRater: function () {
    logger.log('Showing rate dialog!');
  }
};

var _withContacts = new Callback();
_withContacts.fire();

exports.contacts = merge(new PubSub(), {
  getContactList: function () {
    return [];
  },
  withContacts: function () {
    _withContacts.forward(arguments);
  },
  sendAutomatedSMS: function (phone, msg, cb) {
    logger.log('Send Automated SMS:', phone, msg);
    cb && cb();
  },
  sendSMS: function (phone, msg, cb) {
    logger.log('Send SMS:', phone, msg);
    cb && cb();
  },
  getPicture: function (id) {
    return null;
  },
  getPictures: function (ids) {
    return null;
  },
  getPictureBase64: function (id) {
    return null;
  }

});

var _withPhoneNumber = new Callback();
_withPhoneNumber.fire(null);

var _withPhoneNumber = new Callback();
_withPhoneNumber.fire(null);

exports.profile = {
  fullName: '',
  getPicture: function (id) {
    return null;
  },
  getPictureBase64: function (id) {
    return null;
  },
  withPhoneNumber: function () {
    _withPhoneNumber.forward(arguments);
  }
};

exports.sound = {
  playSound: function (url, volume) {
    logger.log('NATIVE shim: play a sound');
  },
  loadSound: function (url) {
    logger.log('NATIVE shim: load a sound');
  },
  pauseSound: function (url) {
    logger.log('NATIVE shim: pause a sound');
  },
  stopSound: function (url) {
    logger.log('NATIVE shim: stop a sound');
  },
  setVolume: function (url, volume) {
    logger.log('NATIVE shim: set the volume of a sound');
  },
  loadBackgroundMusic: function (url) {
    logger.log('NATIVE shim: load background music');
  },
  playBackgroundMusic: function (url) {
    logger.log('NATIVE shim: play background music');
  },
  registerMusic: function (url) {
    logger.log('NATIVE shim: register background music');
  }
};

exports.events = {
  registerHandler: function (eventName) {
  }
};

exports.plugins = {
  sendEvent: function (plugin, eventName) {
    logger.log('NATIVE shim: send a ' + eventName + ' event to the ' + plugin + ' plugin');
  },
  sendRequest: function (plugin, name, cb) {
    logger.log('NATIVE shim: send a ' + name + ' request to the ' + plugin + ' plugin');
  }
};

exports.alerts = new PubSub();
merge(exports.alerts, {
  onNotificationLoad: function () {
  },
  showNotification: function () {
    return -1;
  },
  showRecurringNotification: function () {
    logger.log('Setting up a recurring notification!');
    return -1;
  }
});

exports.social = new PubSub();

import device from 'device';
exports.isSimulator = function () {
  return device.isNativeSimulator;
};

if (!GLOBAL.NATIVE) {
  GLOBAL.NATIVE = exports;
}
