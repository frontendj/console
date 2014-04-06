Timers = (->

  _private =

    listenEvents: ->

      $(document).on "start_timer", (e) =>
        @startTimer(e.timerId)

      $(document).on "stop_timer", (e) =>
        @stopTimer(e.timerId)

      return

    startTimer: (timerId) ->

      @stopTimer timerId
      seconds = @timersStorage[timerId] || 0
      @['timer_'+timerId] = window.setInterval(=>
        seconds += 1
        @timersStorage[timerId] = seconds
      , 1000)

      return

    stopTimer: (timerId) ->
      clearInterval(@['timer_'+timerId]) if @['timer_'+timerId]

      return
    initStorage: ->
      @timersStorage = JSON.parse(sessionStorage.getItem('timers')) || {}

      #Статистику работы с вкладками сохраняем независимо от счётчиков - теряем чуть в точности, но так удобнее
      window.setInterval(=>
        @saveStorage()
      , 1000)

      return

    saveStorage: ->
      sessionStorage.setItem('timers', JSON.stringify(@timersStorage))

      return

  init: ->

    console.log 'init module Timers'

    _private.initStorage()
    _private.listenEvents()

    return

)()

$ -> Timers.init()




