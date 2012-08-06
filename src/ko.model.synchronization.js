/*
*   Knockout Structures - ko.Model.syncronization
*   Created By Dan Matthews (https://github.com/bluefocus)
*
*   Source: https://github.com/kostructures/ko.Model
*   MIT License: http://www.opensource.org/licenses/MIT
*
*   Requires:
*   ko.Model - https://github.com/kostructures/ko.Model
*   knockout-postbox.js - https://github.com/rniemeyer/knockout-postbox
*   json2.js (for ie < 8) - https://github.com/douglascrockford/JSON-js
*/

(function (ko) {
  var Model = {
    channelFor: function(model) {
      var self = this;

      var part1 = self.__syncChannel__();
      var part2 = model.__syncChannel__();
      if(part1 < part2) {
        return part1+part2;
      } else {
        return part2+part1;
      }
    },

    generateSyncChannel: function(n) {
      var selectFrom = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
      var high = selectFrom.length;
      var length = n||20;
      var channel = '';

      for (var n = 0; n < length; n++) {
        channel += selectFrom[(Math.floor(Math.random()*(high-1)) + 1)];
      }

      return name;
    },

    publishOn: function(attr, channel) {
      var self = this;

      console.log('publish on', attr, channel);

      if($.inArray(channel, self.__publishedChannels__()) === -1) {
        self[attr].publishOn(channel);
        self.__publishedChannels__.push(channel);
      }
    },

    stopPublishingOn: function(attr, channel) {
      var self = this;

      console.log('stop publish on', attr, channel);

      if($.inArray(channel, self.__publishedChannels__()) > -1) {
        self.stopPublishingOn(channel);
        self.__publishedChannels__.remove(channel);
      }
    },

    subscribeTo: function(attr, channel) {
      var self = this;

      console.log('subscribe to', attr, channel);

      if($.inArray(channel, self.__subscribedChannels__()) === -1) {
        self[attr].subscribeTo(channel);
        self.__subscribedChannels__.push(channel);
      }
    },

    unsubscribeFrom: function(attr, channel) {
      var self = this;

      console.log('unsubscribe from', attr, channel);

      if($.inArray(channel, self.__subscribedChannels__()) > -1) {
        self[attr].unsubscribeFrom(channel);
        self.__subscribedChannels__.remove(channel);
      }
    },

    syncWith: function(attr, channel) {
      var self = this;

      console.log('sync with', attr, channel);

      if($.inArray(channel, self.__syncedChannels__()) === -1) {
        self[attr].syncWith(channel);
        self.__syncedChannels__.push(channel);
      }
    },

    stopSyncingWith: function(attr, channel) {
      var self = this;

      console.log('stop syncing with', attr, channel);

      if($.inArray(channel, self.__syncedChannels__()) > -1) {
        self[attr].unsubscribeFrom(channel);
        self[attr].stopPublishingOn(channel);
        self.__syncedChannels__.remove(channel);
      }
    },

    sync: function(model, how) {
      var self = this;

      var channel = self.channel_for(model);

      if(how === 'to') {
        for(var attr in self.__defaults__) {
          model.subscribeTo(attr, channel+attr);
          self.publishOn(attr, channel+attr);
        }
      } else if(how === 'from') {
        for(var attr in self.__defaults__) {
          model.publishOn(attr, channel+attr);
          self.subscribeTo(attr, channel+attr);
        }
      } else {
        for(var attr in self.__defaults__) {
          model.syncWith(attr, channel+attr);
          self.syncWith(attr, channel+attr);
        }
      }
    },

    unsync: function(model, how) {
      var self = this;

      var channel = self.channelFor(model);

      if(how === 'to') {
        for(var attr in self.__defaults__) {
          model.unsubscribeFrom(attr, channel+attr);
          self.stopPublishingOn(attr, channel+attr);
        }
      } else if(how === 'from') {
        for(var attr in self.__defaults__) {
          model.stopPublishingOn(attr, channel+attr);
          self.unsubscribeFrom(attr, channel+attr);
        }
      } else {
        for(var attr in self.__defaults__) {
          model.stopSyncingWith(attr, channel+attr);
          self.stopSyncingWith(attr, channel+attr);
        }
      }
    }

  };

  $.extend(ko.Model, Model);

  ko.Model.__modelExtensions__.push(function(self) {
    self.__syncChannel__ = ko.observable(self.generate_sync_channel());
    self.__subscribedChannels__ = ko.observableArray();
    self.__publishedChannels__ = ko.observableArray();
    self.__syncedChannels__ = ko.observableArray();
  });
})(ko);

