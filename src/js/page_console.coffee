window.PageConsole = (->

  # Эти функции разрешим выполнять через консоль
  _forConsole =

    showStat: ->

      timersStorage = JSON.parse(sessionStorage.getItem('timers')) || {}

      message = 'Общее время работы со страницей: '+ _private.secondsDecline(timersStorage['page'])+'<br>'
      message += 'Детализация времени просмотра табов:'
      $('#b-tabs-titles .b-tabs-titles__item').each (index) ->
        tabId = $(this).data('tab')
        tabName = $(this).text()
        seconds = timersStorage[tabId] || 0
        message += ('<br>' + index + ' ' + tabName + ': ' + _private.secondsDecline(seconds))

      # Здесь и в дальнейшем вместо вызовы события логирования вызываем функцию логирования напрямую для удобства
      #$('#console').triggerHandler
      # 'type': 'log_message'
      # 'logMessage': message
      _private.printMessage(message)

      return

  _private =

    showConsole: ->
      $('#console').removeClass('disabled').find('.b-console__loader').hide()

    listenEvents: ->

      $('#console').on "log_message", (e) =>
        @printMessage(e.logMessage)

      $(document).on "function_call", (e) ->
        if e.targetModule == 'PageConsole'
          if _forConsole[e.functionName]
            _forConsole[e.functionName].apply(@, e.functionArguments)
          else
            message = 'Функция ' + functionName + ' не найдена'

        if message
          @printMessage(message)

      return

    stopListen: ->
      $('#console').off "log_message"
      $('#console-form').off 'submit.console'

    printMessage: (message) ->
      $('#console-log').append('<div class="item">'+message+'</div>')
      $('#console-log').scrollTop $('#console-log')[0].scrollHeight
      return

    secondsDecline: (value) ->
      result = value
      endings = ['секунда', 'секунды', 'секунд']
      value = value % 100
      if value >= 11 and value <= 19
        ending = endings[2]
      else
        i = value % 10
        switch i
          when (1)
            ending = endings[0]
          when (2), (3), (4)
            ending = endings[1]
          else
            ending = endings[2]
      result + ' ' + ending

    catchUserActivity: ->

      $('#console-form').on 'submit.console', (e) =>
        consoleVal = $('#console-input').val().trim()
        e.preventDefault()

        if consoleVal.length >= 1
          @logCommand(consoleVal)
          consoleVal = @makeDirty(consoleVal)
          @processCommand(consoleVal)
        else
          @printMessage('/>')

      $(document).on 'keydown', (e) =>
        code = ((if e.keyCode then e.keyCode else e.which))
        if $('#console-input').is(":focus")
          if code is 40
            @historyJump('down')
            e.preventDefault()
          else if code is 38
            @historyJump('up')
            e.preventDefault()


      $('#console-header .b-console-icon').on 'click', (e) =>
        if $(e.target).hasClass 'unfold'
          $('#console').removeClass 'folded'
        if $(e.target).hasClass 'fold'
          $('#console').addClass 'folded'
        if $(e.target).hasClass 'close'
          $('#console').addClass 'disabled'
          @stopListen()

      return

    initStorage: ->
      @logStorage = JSON.parse(sessionStorage.getItem('log')) || []
      return

    saveStorage: ->
      sessionStorage.setItem('log', JSON.stringify(@logStorage))
      return

    logCommand: (command) ->

      lastCommand = @logStorage[@logStorage.length-1]
      if lastCommand != command
        @logStorage.push(command)
        @logStorage.shift() if @logStorage.length > 10
        @saveStorage()

      @commandIndex = @logStorage.length
      return

    parseArguments: (args) ->
      if (typeof args == 'string')
        args = args.split(/\s*,\s*/g)
      else
        if args.length == 1
          if (typeof args[0] == 'string')
            args = args[0].split(/\s*,\s*/g)
          else
            args = args[0]
      args

    processCommand: (command) ->

      @printMessage('/> '+command)

      $('#console-input').val('')
      re = /^(selectTab|swapTabs|showStat)\(([^)]*)\)$/i
      found = command.match(re)

      if found && found[1]
        switch found[1]
          when 'selectTab', 'swapTabs'
            module = 'Tabs'
          when 'showStat'
            module = 'PageConsole'

        if module
          $(document).triggerHandler
            'type': 'function_call'
            'targetModule': module
            'functionName': found[1]
            'functionArguments': @parseArguments(found[2])

      else
        message = 'Неподдерживаемая команда'

      if message
        @printMessage(message)

      return

    historyJump: (direction) ->

      if @logStorage.length >= 1

        @commandIndex = @logStorage.length if @commandIndex == undefined

        nextIndex = (if (direction == 'up') then (@commandIndex - 1) else (@commandIndex + 1))
        if nextIndex >= @logStorage.length
          nextIndex = @logStorage.length
          $('#console-input').val('')
        else
          if nextIndex < 0
            nextIndex = @logStorage.length-1
          nextCommand = @logStorage[nextIndex]
          $('#console-input').val nextCommand

        @commandIndex = nextIndex

      return

    makeDirty: (string) ->
      string = string.replace(/</g, '&lt;').replace(/>/g, '&gt;')
      string

  init: ->

    console.log 'init module PageConsole'

    _private.stopListen()

    _private.initStorage()
    _private.showConsole()
    _private.listenEvents()
    _private.catchUserActivity()

    return

)()

$ -> window.PageConsole.init()




