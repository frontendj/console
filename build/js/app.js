(function() {
  window.App = {
    initialize: function() {
      console.log('init main App');
      $(document).triggerHandler({
        'type': 'start_timer',
        'timerId': 'page'
      });
      return setTimeout(((function(_this) {
        return function() {
          console.log('Добавляем модуль PageConsole');
          return _this.createScript('page-console', 'build/js/page_console.js', true);
        };
      })(this)), 1000);
    },
    createScript: function(id, src, async) {
      var fjs, js;
      if (async == null) {
        async = false;
      }
      fjs = document.getElementsByTagName("script")[0];
      if (document.getElementById(id)) {
        return;
      }
      js = document.createElement("script");
      js.id = id;
      js.src = src;
      js.async = async;
      return fjs.parentNode.insertBefore(js, fjs);
    }
  };

  $(function() {
    return App.initialize();
  });

}).call(this);
