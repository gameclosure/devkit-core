import PubSub from 'lib/PubSub';

import traversal from './traversal';
import _screenshot from './screenshot';
let screenshot = _screenshot.screenshot;

import Channel from './Channel';

import BridgeTransport from './BridgeTransport';

var API = Class(function () {
  this.init = function () {
    this._channels = {};
  };

  this.getChannel = function (channelName) {
    var channel = this._channels[channelName];
    if (!channel) {
      channel = new Channel(channelName);
      this._channels[channelName] = channel;

      if (_transport) {
        channel.setTransport(_transport);
      }
    }




    return channel;
  };

  this.__onConnect = function (transport) {
    for (var channel in this._channels) {
      this._channels[channel].setTransport(transport);
    }
  };

  this.screenshot = screenshot;
});

exports = new API();

merge(exports, traversal);

var _transport;

// private callback for when connection is established
var setTransport = bind(exports, function (transport) {
  _transport = transport;
  transport.on('disconnect', function () {
    _transport = null;
  });

  this.__onConnect(transport);
});

var tryToConnect = function () {
  // try to connect
  if (CONFIG.simulator) {
    // try a direct connection to an outer frame (assuming we're in a
    // simulator iframe)
    var devkit;
    try {
      devkit = window.parent.devkit;
    } catch (e) {
    }



    if (!devkit || !devkit.getSimulator) {
      return;
    }


    var simulator = devkit.getSimulator(CONFIG.simulator.deviceId);
    if (simulator) {
      var bridge = new BridgeTransport();
      simulator.setTransport(bridge.a);
      setTransport(bridge.b);
    }
  } else {
    if (/^browser/.test(CONFIG.target)) {
    } else {
    }
  }
};

tryToConnect();
