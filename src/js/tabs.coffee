Tabs = (->

  # Эти функции разрешим выполнять через консоль
  _forConsole =

    selectTab: (tabIndex, noLogging = false) ->
      if tabIndex != undefined && tabIndex >= 0
        tabTitleItem = $(".b-tabs-titles__item")[tabIndex]
        if tabTitleItem
          tabId = $(tabTitleItem).data('tab')
          tabName = $(tabTitleItem).text()
          _private.activateTab(tabId)
          message = 'Выбран таб №'+tabIndex+' "'+tabName+'".'
        else
          message = 'Не удалось выбрать таб №'+tabIndex+'. Доступны табы с 0 по '+ ($(".b-tabs-titles__item").length-1)
      else
        message = 'Не удалось выбрать таб ' + tabIndex

      if message && !noLogging
        $(document).triggerHandler
          'type': 'log_message'
          'logMessage': message

      return

    swapTabs: (firstTabIndex, secondTabIndex) ->

      message = 'Не удалось поменять табы'

      if firstTabIndex != undefined && secondTabIndex != undefined
        firstTabTitleItem = $('.b-tabs-titles__item:nth-child('+(1+parseInt(firstTabIndex))+')')
        secondTabTitleItem = $('.b-tabs-titles__item:nth-child('+(1+parseInt(secondTabIndex))+')')

        if firstTabTitleItem.length && secondTabTitleItem.length

          firstTabName = firstTabTitleItem.text()
          secondTabName = secondTabTitleItem.text()

          temp = firstTabTitleItem.clone()
          temp.insertBefore secondTabTitleItem
          firstTabTitleItem.replaceWith secondTabTitleItem

          message = 'Поменяли табы №'+firstTabIndex+' "'+firstTabName+'" и №'+secondTabIndex+' "'+secondTabName+'" местами.'

        else
          message = 'Не удалось поменять табы №'+firstTabIndex+' и №'+secondTabIndex+'. Доступны табы с 0 по '+ ($(".b-tabs-titles__item").length-1)

      if message
        $(document).triggerHandler
          'type': 'log_message'
          'logMessage': message

      return

  _private =

    catchUserActivity: ->
      $('#b-tabs-titles').on 'click', '.b-tabs-titles__item', ->
        if not $(this).hasClass('active')
          tab = $(this).data('tab')
          _private.activateTab(tab)

      return

    activateTab: (tabId) ->
      $('.b-tabs-titles__item[data-tab!="'+tabId+'"]').trigger('deactivate')
      $('.b-tabs-titles__item[data-tab="'+tabId+'"]').trigger('activate')

      return

    listenEvents: ->

      $(".b-tabs-titles").on "deactivate", ".b-tabs-titles__item", ->
        tabId = $(this).removeClass('active').data('tab')
        $('.b-tabs-boxes__item[data-tab="'+tabId+'"]').removeClass('active')
        $(document).triggerHandler
          'type': 'stop_timer'
          'timerId': tabId

      $(".b-tabs-titles").on "activate", ".b-tabs-titles__item", ->
        tabId = $(this).addClass('active').data('tab')
        $('.b-tabs-boxes__item[data-tab="'+tabId+'"]').addClass('active')
        $(document).triggerHandler
          'type': 'start_timer'
          'timerId': tabId

      $(document).on "function_call", (e) ->
        if e.targetModule == 'Tabs'
          if _forConsole[e.functionName]
            _forConsole[e.functionName].apply(@, e.functionArguments)
          else
            message = 'Функция ' + functionName + ' не найдена'

        if message
          $(document).triggerHandler
            'type': 'log_message'
            'logMessage': message

      return

  init: ->

    console.log 'init module Tabs'

    _private.listenEvents()
    _private.catchUserActivity()
    _forConsole.selectTab(0, true)





    return
)()

$ -> Tabs.init()




