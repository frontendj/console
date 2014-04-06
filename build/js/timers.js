(function() {
  var Timers;

  Timers = (function() {
    var _private;
    _private = {
      listenEvents: function() {
        $(document).on("start_timer", (function(_this) {
          return function(e) {
            return _this.startTimer(e.timerId);
          };
        })(this));
        $(document).on("stop_timer", (function(_this) {
          return function(e) {
            return _this.stopTimer(e.timerId);
          };
        })(this));
      },
      startTimer: function(timerId) {
        var seconds;
        this.stopTimer(timerId);
        seconds = this.timersStorage[timerId] || 0;
        this['timer_' + timerId] = window.setInterval((function(_this) {
          return function() {
            seconds += 1;
            return _this.timersStorage[timerId] = seconds;
          };
        })(this), 1000);
      },
      stopTimer: function(timerId) {
        if (this['timer_' + timerId]) {
          clearInterval(this['timer_' + timerId]);
        }
      },
      initStorage: function() {
        this.timersStorage = JSON.parse(sessionStorage.getItem('timers')) || {};
        window.setInterval((function(_this) {
          return function() {
            return _this.saveStorage();
          };
        })(this), 1000);
      },
      saveStorage: function() {
        sessionStorage.setItem('timers', JSON.stringify(this.timersStorage));
      }
    };
    return {
      init: function() {
        console.log('init module Timers');
        _private.initStorage();
        _private.listenEvents();
      }
    };
  })();

  $(function() {
    return Timers.init();
  });

}).call(this);
