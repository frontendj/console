(function() {
  var Tabs;

  Tabs = (function() {
    var _forConsole, _private;
    _forConsole = {
      selectTab: function(tabIndex, noLogging) {
        var message, tabId, tabName, tabTitleItem;
        if (noLogging == null) {
          noLogging = false;
        }
        if (/^\d+$/.test(tabIndex)) {
          tabTitleItem = $(".b-tabs-titles__item")[tabIndex];
          if (tabTitleItem) {
            tabId = $(tabTitleItem).data('tab');
            tabName = $(tabTitleItem).text();
            _private.activateTab(tabId);
            message = 'Выбран таб №' + tabIndex + ' "' + tabName + '".';
          } else {
            message = 'Не удалось выбрать таб №' + tabIndex + '. Доступны табы с 0 по ' + ($(".b-tabs-titles__item").length - 1);
          }
        } else {
          message = 'Не удалось выбрать таб ' + tabIndex;
        }
        if (message && !noLogging) {
          $('#console').triggerHandler({
            'type': 'log_message',
            'logMessage': message
          });
        }
      },
      swapTabs: function(firstTabIndex, secondTabIndex) {
        var firstTabName, firstTabTitleItem, message, secondTabName, secondTabTitleItem, temp;
        message = 'Не удалось поменять табы. Неверный синтаксис';
        if (/^\d+$/.test(firstTabIndex) && /^\d+$/.test(secondTabIndex)) {
          firstTabTitleItem = $('.b-tabs-titles__item:nth-child(' + (1 + parseInt(firstTabIndex)) + ')');
          secondTabTitleItem = $('.b-tabs-titles__item:nth-child(' + (1 + parseInt(secondTabIndex)) + ')');
          if (firstTabTitleItem.length && secondTabTitleItem.length) {
            firstTabName = firstTabTitleItem.text();
            secondTabName = secondTabTitleItem.text();
            temp = firstTabTitleItem.clone();
            temp.insertBefore(secondTabTitleItem);
            firstTabTitleItem.replaceWith(secondTabTitleItem);
            message = 'Поменяли табы №' + firstTabIndex + ' "' + firstTabName + '" и №' + secondTabIndex + ' "' + secondTabName + '" местами.';
          } else {
            message = 'Не удалось поменять табы №' + firstTabIndex + ' и №' + secondTabIndex + '. Доступны табы с 0 по ' + ($(".b-tabs-titles__item").length - 1);
          }
        }
        if (message) {
          $('#console').triggerHandler({
            'type': 'log_message',
            'logMessage': message
          });
        }
      }
    };
    _private = {
      catchUserActivity: function() {
        $('#b-tabs-titles').on('click', '.b-tabs-titles__item', function() {
          var tab;
          if (!$(this).hasClass('active')) {
            tab = $(this).data('tab');
            return _private.activateTab(tab);
          }
        });
      },
      activateTab: function(tabId) {
        $('.b-tabs-titles__item[data-tab!="' + tabId + '"]').trigger('deactivate');
        $('.b-tabs-titles__item[data-tab="' + tabId + '"]').trigger('activate');
      },
      listenEvents: function() {
        $(".b-tabs-titles").on("deactivate", ".b-tabs-titles__item", function() {
          var tabId;
          tabId = $(this).removeClass('active').data('tab');
          $('.b-tabs-boxes__item[data-tab="' + tabId + '"]').removeClass('active');
          return $(document).triggerHandler({
            'type': 'stop_timer',
            'timerId': tabId
          });
        });
        $(".b-tabs-titles").on("activate", ".b-tabs-titles__item", function() {
          var tabId;
          tabId = $(this).addClass('active').data('tab');
          $('.b-tabs-boxes__item[data-tab="' + tabId + '"]').addClass('active');
          return $(document).triggerHandler({
            'type': 'start_timer',
            'timerId': tabId
          });
        });
        $(document).on("function_call.Tabs", function(e) {
          var message;
          if (_forConsole[e.functionName]) {
            _forConsole[e.functionName].apply(this, e.functionArguments);
          } else {
            message = 'Функция ' + functionName + ' не найдена';
          }
          if (message) {
            return $('#console').triggerHandler({
              'type': 'log_message',
              'logMessage': message
            });
          }
        });
      }
    };
    return {
      init: function() {
        console.log('init module Tabs');
        _private.listenEvents();
        _private.catchUserActivity();
        _forConsole.selectTab(0, true);
      }
    };
  })();

  $(function() {
    return Tabs.init();
  });

}).call(this);
