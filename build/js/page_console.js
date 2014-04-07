(function() {
  window.PageConsole = (function() {
    var _forConsole, _private;
    _forConsole = {
      showStat: function() {
        var message, timersStorage;
        timersStorage = JSON.parse(sessionStorage.getItem('timers')) || {};
        message = 'Общее время работы со страницей: ' + _private.secondsDecline(timersStorage['page']) + '<br>';
        message += 'Детализация времени просмотра табов:';
        $('#b-tabs-titles .b-tabs-titles__item').each(function(index) {
          var seconds, tabId, tabName;
          tabId = $(this).data('tab');
          tabName = $(this).text();
          seconds = timersStorage[tabId] || 0;
          return message += '<br>' + index + ' ' + tabName + ': ' + _private.secondsDecline(seconds);
        });
        _private.printMessage(message);
      }
    };
    _private = {
      showConsole: function() {
        return $('#console').removeClass('disabled').find('.b-console__loader').hide();
      },
      listenEvents: function() {
        $('#console').on("log_message", (function(_this) {
          return function(e) {
            return _this.printMessage(e.logMessage);
          };
        })(this));
        $(document).on("function_call", function(e) {
          var message;
          if (e.targetModule === 'PageConsole') {
            if (_forConsole[e.functionName]) {
              _forConsole[e.functionName].apply(this, e.functionArguments);
            } else {
              message = 'Функция ' + functionName + ' не найдена';
            }
          }
          if (message) {
            return this.printMessage(message);
          }
        });
      },
      stopListen: function() {
        $('#console').off("log_message");
        return $('#console-form').off('submit.console');
      },
      printMessage: function(message) {
        $('#console-log').append('<div class="item">' + message + '</div>');
        $('#console-log').scrollTop($('#console-log')[0].scrollHeight);
      },
      secondsDecline: function(value) {
        var ending, endings, i, result;
        result = value;
        endings = ['секунда', 'секунды', 'секунд'];
        value = value % 100;
        if (value >= 11 && value <= 19) {
          ending = endings[2];
        } else {
          i = value % 10;
          switch (i) {
            case 1.:
              ending = endings[0];
              break;
            case 2.:
            case 3.:
            case 4.:
              ending = endings[1];
              break;
            default:
              ending = endings[2];
          }
        }
        return result + ' ' + ending;
      },
      catchUserActivity: function() {
        $('#console-form').on('submit.console', (function(_this) {
          return function(e) {
            var consoleVal;
            consoleVal = $('#console-input').val().trim();
            e.preventDefault();
            if (consoleVal.length >= 1) {
              _this.logCommand(consoleVal);
              consoleVal = _this.makeDirty(consoleVal);
              return _this.processCommand(consoleVal);
            } else {
              return _this.printMessage('/>');
            }
          };
        })(this));
        $(document).on('keydown', (function(_this) {
          return function(e) {
            var code;
            code = (e.keyCode ? e.keyCode : e.which);
            if ($('#console-input').is(":focus")) {
              if (code === 40) {
                _this.historyJump('down');
                return e.preventDefault();
              } else if (code === 38) {
                _this.historyJump('up');
                return e.preventDefault();
              }
            }
          };
        })(this));
        $('#console-header .b-console-icon').on('click', (function(_this) {
          return function(e) {
            if ($(e.target).hasClass('unfold')) {
              $('#console').removeClass('folded');
            }
            if ($(e.target).hasClass('fold')) {
              $('#console').addClass('folded');
            }
            if ($(e.target).hasClass('close')) {
              $('#console').addClass('disabled');
              return _this.stopListen();
            }
          };
        })(this));
      },
      initStorage: function() {
        this.logStorage = JSON.parse(sessionStorage.getItem('log')) || [];
      },
      saveStorage: function() {
        sessionStorage.setItem('log', JSON.stringify(this.logStorage));
      },
      logCommand: function(command) {
        var lastCommand;
        lastCommand = this.logStorage[this.logStorage.length - 1];
        if (lastCommand !== command) {
          this.logStorage.push(command);
          if (this.logStorage.length > 10) {
            this.logStorage.shift();
          }
          this.saveStorage();
        }
        this.commandIndex = this.logStorage.length;
      },
      parseArguments: function(args) {
        if (typeof args === 'string') {
          args = args.split(/\s*,\s*/g);
        } else {
          if (args.length === 1) {
            if (typeof args[0] === 'string') {
              args = args[0].split(/\s*,\s*/g);
            } else {
              args = args[0];
            }
          }
        }
        return args;
      },
      processCommand: function(command) {
        var found, message, module, re;
        this.printMessage('/> ' + command);
        $('#console-input').val('');
        re = /^(selectTab|swapTabs|showStat)\(([^)]*)\)$/i;
        found = command.match(re);
        if (found && found[1]) {
          switch (found[1]) {
            case 'selectTab':
            case 'swapTabs':
              module = 'Tabs';
              break;
            case 'showStat':
              module = 'PageConsole';
          }
          if (module) {
            $(document).triggerHandler({
              'type': 'function_call',
              'targetModule': module,
              'functionName': found[1],
              'functionArguments': this.parseArguments(found[2])
            });
          }
        } else {
          message = 'Неподдерживаемая команда';
        }
        if (message) {
          this.printMessage(message);
        }
      },
      historyJump: function(direction) {
        var nextCommand, nextIndex;
        if (this.logStorage.length >= 1) {
          if (this.commandIndex === void 0) {
            this.commandIndex = this.logStorage.length;
          }
          nextIndex = (direction === 'up' ? this.commandIndex - 1 : this.commandIndex + 1);
          if (nextIndex >= this.logStorage.length) {
            nextIndex = this.logStorage.length;
            $('#console-input').val('');
          } else {
            if (nextIndex < 0) {
              nextIndex = this.logStorage.length - 1;
            }
            nextCommand = this.logStorage[nextIndex];
            $('#console-input').val(nextCommand);
          }
          this.commandIndex = nextIndex;
        }
      },
      makeDirty: function(string) {
        string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return string;
      }
    };
    return {
      init: function() {
        console.log('init module PageConsole');
        _private.stopListen();
        _private.initStorage();
        _private.showConsole();
        _private.listenEvents();
        _private.catchUserActivity();
      }
    };
  })();

  $(function() {
    return window.PageConsole.init();
  });

}).call(this);
