window.App =

  initialize: ->

    console.log 'init main App'

    $(document).triggerHandler
      'type': 'start_timer'
      'timerId': 'page'

    # консоль можно подключить попозже раз уж сделали все в виде модулей
    setTimeout (=>
      console.log 'Добавляем модуль PageConsole'
      @createScript('page-console', 'build/js/page_console.js', true)
    ), 1000

  createScript: (id, src, async = false) ->
    fjs = document.getElementsByTagName("script")[0]
    return  if document.getElementById(id)
    js = document.createElement("script")
    js.id = id
    js.src = src
    js.async = async
    fjs.parentNode.insertBefore js, fjs

$ -> App.initialize()
