"use strict";

(function polyfill() {
  if (!Object.assign) {
    Object.defineProperty(Object, 'assign', {
      enumerable: false,
      configurable: true,
      writable: true,
      value: function(target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert first argument to object')
        }
        var to = Object(target)
        for (var i = 1; i < arguments.length; i++) {
          var nextSource = arguments[i]
          if (nextSource === undefined || nextSource === null) {
            continue
          }
          nextSource = Object(nextSource)
          var keysArray = Object.keys(Object(nextSource))
          for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
            var nextKey = keysArray[nextIndex]
            var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)
            if (desc !== undefined && desc.enumerable) {
              to[nextKey] = nextSource[nextKey]
            }
          }
        }
        return to
      }
    })
  }

  function atob(input) {
    input = String(input);
    input = input.replace(/[ \t\n\f\r]/g, '')
    if (input.length % 4 == 0 && /==?$/.test(input)) {
      input = input.replace(/==?$/, '')
    }
    if (input.length % 4 == 1 || !/^[+/0-9A-Za-z]*$/.test(input)) {
      return null
    }
    var output = ''
    var buffer = 0
    var accumulatedBits = 0;
    for (var i = 0; i < input.length; i++) {
      buffer <<= 6
      buffer |= atobLookup(input[i])
      accumulatedBits += 6
      if (accumulatedBits == 24) {
        output += String.fromCharCode((buffer & 0xff0000) >> 16)
        output += String.fromCharCode((buffer & 0xff00) >> 8)
        output += String.fromCharCode(buffer & 0xff)
        buffer = accumulatedBits = 0
      }
    }
    if (accumulatedBits == 12) {
      buffer >>= 4
      output += String.fromCharCode(buffer)
    } else if (accumulatedBits == 18) {
      buffer >>= 2
      output += String.fromCharCode((buffer & 0xff00) >> 8)
      output += String.fromCharCode(buffer & 0xff)
    }
    return output
  }

  function atobLookup(chr) {
    if (/[A-Z]/.test(chr)) {
      return chr.charCodeAt(0) - 'A'.charCodeAt(0)
    }
    if (/[a-z]/.test(chr)) {
      return chr.charCodeAt(0) - 'a'.charCodeAt(0) + 26
    }
    if (/[0-9]/.test(chr)) {
      return chr.charCodeAt(0) - '0'.charCodeAt(0) + 52
    }
    if (chr == '+') {
      return 62
    }
    if (chr == '/') {
      return 63
    }
  }

  function btoa(s) {
    var i
    s = String(s)
    for (i = 0; i < s.length; i++) {
      if (s.charCodeAt(i) > 255) {
        return null
      }
    }
    var out = ''
    for (i = 0; i < s.length; i += 3) {
      var groupsOfSix = [undefined, undefined, undefined, undefined];
      groupsOfSix[0] = s.charCodeAt(i) >> 2
      groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4
      if (s.length > i + 1) {
        groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4
        groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2
      }
      if (s.length > i + 2) {
        groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6
        groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f
      }
      for (var j = 0; j < groupsOfSix.length; j++) {
        if (typeof groupsOfSix[j] == 'undefined') {
          out += '='
        } else {
          out += btoaLookup(groupsOfSix[j])
        }
      }
    }
    return out
  }

  function btoaLookup(idx) {
    if (idx < 26) {
      return String.fromCharCode(idx + 'A'.charCodeAt(0))
    }
    if (idx < 52) {
      return String.fromCharCode(idx - 26 + 'a'.charCodeAt(0))
    }
    if (idx < 62) {
      return String.fromCharCode(idx - 52 + '0'.charCodeAt(0))
    }
    if (idx == 62) {
      return '+'
    }
    if (idx == 63) {
      return '/'
    }
  }

  if (!window.atob) window.atob = atob
  if (!window.btoa) window.btoa = btoa
})();

(function() {
  var debug = BOTHUB.debug || false
  var language = BOTHUB.language
  var platforms = BOTHUB.platforms || ['facebook', 'bothub']

  if (['zh_CN', 'zh_TW', 'en_US'].indexOf(BOTHUB.language) === -1) {
    language = 'zh_CN'
  }

  var Utils = {
    urlEncode: function(param, key, encode) {
      encode = encode || true
      if (!param) return ''
      var paramStr = ''

      if ((/string|number|boolean/).test(typeof param)) {
        return (paramStr += "&" + key + "=" + (encode ? encodeURIComponent(param) : param))
      }

      for (var i in param) {
        var k = !key ? i : key + "[" + i + "]"
        paramStr += urlEncode(param[i], k, encode)
      }

      return paramStr
    },
    getUrlParam: function(name) {
      var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
      var r = window.location.search.substr(1).match(reg)
      if (r != null) return (decodeURI(r[2])); return null
    },
    uuid: function(a) {
      return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, this.uuid)
    },
    copy: function(obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    log: function() {
      if (debug) {
        for (var key in arguments) {
          console.log(arguments[key])
        }
      }
    },
    jsonp: function(url, callback) {
      var script = document.createElement('script')
      var callbackName = 'jsonp_callback_bh' + Math.round(100000 * Math.random())

      window[callbackName] = function(data) {
        document.body.removeChild(script)
        callback && callback(data)
      }

      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName
      document.body.appendChild(script)
    },
    ajax: function(type, url, data) {
      var xhr

      if (window.XDomainRequest) xhr = new XDomainRequest()
      else if (window.XMLHttpRequest) xhr = new XMLHttpRequest()
      else xhr = new ActiveXObject("Microsoft.XMLHTTP")

      xhr.open(type, url)

      if (type === 'POST') {
        xhr.setRequestHeader && xhr.setRequestHeader('Content-Type', 'application/json')
      }

      xhr.send(type === 'GET' ? null : JSON.stringify(data))

      return xhr
    },
    Http: {
      get: function(url, data) {
        return Utils.ajax('GET', url, data)
      },
      post: function(url, data) {
        return Utils.ajax('POST', url, data)
      }
    },
    getCustomUserId: function() {
      var custom_user_id = this.getUrlParam('custom_user_id') || localStorage.getItem('bothub_custom_user_id') || ''
      if (custom_user_id) return custom_user_id
      custom_user_id = this.uuid()
      localStorage.setItem('bothub_custom_user_id', custom_user_id)
      return custom_user_id
    },
    getFacebookUserId: function(key) {
      var fb_user_id = this.getUrlParam(key) || localStorage.getItem(key) || ''
  
      if (fb_user_id) {
        localStorage.setItem(key, fb_user_id)
      }

      return fb_user_id
    },
    getEventId: function () {
      return 'bh_eid_' + this.uuid()
    },
    getUserRef: function(force) {
      force = force || false
  
      var user_ref = localStorage.getItem('bothub_user_ref')
  
      if (force || !user_ref) {
        user_ref = location.host.replace(/\./g, '_') + '_' + this.uuid()
        localStorage.setItem('bothub_user_ref', user_ref)
      }

      return user_ref
    },
    getPlugin: function(name) {
      var id = name.replace('fb', 'bothub')
      var plugin = window[id]
  
      if (plugin) {
        plugin.setAttribute('class', name)
        return plugin
      }

      return document.getElementsByClassName(name)[0]
    },
    loadFacebookSdk: function() {
      if (window['facebook-jssdk']) return
      Utils.log('start load facebook sdk...')
      var facebook_script = document.createElement('script')
      facebook_script.id = 'facebook-jssdk'
      facebook_script.src = 'https://connect.facebook.net/' + language + '/' + (debug ? 'sdk/debug' : 'sdk') + '.js';
      document.body.appendChild(facebook_script)
    }
  }

  function BotHub() {
    var config = BOTHUB

    config.page_id = config.facebook_page_id
    config.custom_user_id = Utils.getCustomUserId()
    config.fb_user_id = Utils.getFacebookUserId('fb_user_id')
    config.api_server = config.api_server || 'https://t.bothub.ai/'
    config.entrance = config.entrance || {}
    config.ecommerce = config.ecommerce || {}

    var Messenger = {
      origin: location.protocol + "//" + location.host,
      page_id: config.facebook_page_id,
      messenger_app_id: config.messenger_app_id || '985673201550272',
      user_ref: Utils.getUserRef(),
      fb_user_id: config.fb_user_id,
      allow_login: true,
    }

    this.Messenger = Messenger

    this.Marketing = {
      /**
       * @param {string}  eventName
       * @param {number}  valueToSum
       * @param {object}  params
       */
      logEvent: function(eventName, valueToSum, params) {
        if (!eventName) return
        if (!valueToSum) valueToSum = null
        if (!(params instanceof Object)) params = {}

        var event = {
          id: Utils.getEventId(),
          ev: eventName,
          params: Utils.copy(params)
        }

        if (config.ecommerce) {
          delete event.ev
        }

        if (config.entrance.fb_messenger_checkbox_ref) {
          event = Object.assign(event, config.entrance.fb_messenger_checkbox_ref)
        }

        event.custom_user_id = config.custom_user_id
        event.user_agent = window.navigator && window.navigator.userAgent

        if (config.fb_user_id) {
          params.fb_user_id = config.fb_user_id
          event.fb_user_id = config.fb_user_id
        }

        if (!event.user_id && !event.fb_user_id && !event.custom_user_id) {
          return
        }

        params.user_ref = Utils.getUserRef()
        params.ref = JSON.stringify(event)

        var MessengerParams = {
          'app_id': Messenger.messenger_app_id,
          'page_id': Messenger.page_id,
          'user_ref': params.user_ref,
          'ref': params.ref
        }

        if (platforms.indexOf('facebook') >= 0) {
          var analyticsParams = Utils.copy(params)
          delete analyticsParams.user_ref
          delete analyticsParams.ref

          if (eventName === 'fb_mobile_purchase') {
            FB.AppEvents.logPurchase(
              valueToSum,
              params[FB.AppEvents.ParameterNames.CURRENCY],
              analyticsParams
            )
          } else {
            FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, MessengerParams)
            FB.AppEvents.logEvent(eventName, valueToSum, analyticsParams)

            Utils.log({
              eventName: eventName,
              valueToSum: valueToSum,
              analyticsParams: analyticsParams
            })
          }
        } else if (platforms.indexOf('bothub') >= 0) {
          delete MessengerParams.user_ref
          window.query = { cd: MessengerParams }
          var query = Utils.urlEncode({ cd: MessengerParams })
          Utils.jsonp(config.api_server + "analytics/events?action=store" + query)
        }
      },

      /**
       * This function will log AddedToCart App Event
       * @param {string} contentId
       * @param {string} contentType
       * @param {string} currency
       * @param {number} price
       */
      logAddedToCartEvent: function(contentId, contentType, currency, price) {
        var params = {}
        var p = FB.AppEvents.ParameterNames
        params[p.CONTENT_ID] = contentId
        params[p.CONTENT_TYPE] = contentType
        params[p.CURRENCY] = currency
        this.logEvent(FB.AppEvents.EventNames.ADDED_TO_CART, price, params)
      },

      /**
       * This function will log AddedToWishlist App Event
       * @param {string} contentId
       * @param {string} contentType
       * @param {string} currency
       * @param {number} price
       */
      logAddedToWishlistEvent: function(contentId, contentType, currency, price) {
        var params = {}
        var p = FB.AppEvents.ParameterNames
        params[p.CONTENT_ID] = contentId
        params[p.CONTENT_TYPE] = contentType
        params[p.CURRENCY] = currency
        this.logEvent(FB.AppEvents.EventNames.ADDED_TO_WISHLIST, price, params)
      },

      /**
       * This function will log InitiatedCheckout App Event
       * @param {string} contentId
       * @param {string} contentType
       * @param {number} numItems
       * @param {boolean} paymentInfoAvailable
       * @param {string} currency
       * @param {number} totalPrice
       */
      logInitiatedCheckoutEvent: function(contentId, contentType, numItems, paymentInfoAvailable, currency, totalPrice) {
        var params = {}
        var p = FB.AppEvents.ParameterNames
        params[p.CONTENT_ID] = contentId
        params[p.CONTENT_TYPE] = contentType
        params[p.NUM_ITEMS] = numItems
        params[p.PAYMENT_INFO_AVAILABLE] = paymentInfoAvailable ? 1 : 0
        params[p.CURRENCY] = currency
        this.logEvent(FB.AppEvents.EventNames.INITIATED_CHECKOUT, totalPrice, params)
      },

      /**
       * This function will log purchase App Event
       * @param {string} contentId
       * @param {string} currency
       * @param {number} totalPrice
       */
      logPurchaseEvent: function(contentId, currency, totalPrice, contentType) {
        var params = {}
        var p = FB.AppEvents.ParameterNames
        params[p.CONTENT_ID] = contentId
        params[p.CURRENCY] = currency
        params[p.CONTENT_TYPE] = contentType
        params['value_to_sum'] = totalPrice
        this.logEvent('fb_mobile_purchase', totalPrice, params)
      }
    }

    if (platforms.indexOf('facebook') === -1) {
      return
    }

    var ECommerce = function() {
      var plugins = {
        messenger_checkbox: {
          receipt: '',
          receipt_id: '',
          sent: false
        },
        send_to_messenger: {
          receipt: '',
          receipt_id: '',
          feed: '',
          feed_id: '',
          sent: false
        }
      }

      Object.assign(plugins.messenger_checkbox, config.ecommerce.messenger_checkbox)
      Object.assign(plugins.send_to_messenger, config.ecommerce.send_to_messenger)

      return {
        'plugins': plugins,
        getReceiptId: function(name) {
          var receipt_id = plugins[name].receipt_id
          if (receipt_id) return receipt_id
          plugins[name].receipt_id = Utils.uuid()
          return plugins[name].receipt_id
        },
        getFeedId: function(name) {
          var feed_id = plugins[name].feed_id
          if (feed_id) return feed_id
          plugins[name].feed_id = Utils.uuid()
          return plugins[name].feed_id
        },
        sendToMessenger: function(name) {
          var plugin = plugins[name]
          if (plugin.sent) return
  
          if (plugin.receipt) {
            plugin.receipt = {
              ev: 'bh_receipt',
              receipt_id: plugin.receipt_id,
              page_id: config.page_id,
              data: plugin.receipt
            }
            Utils.Http.post(config.api_server + 'tr/', plugin.receipt)
            return plugin.sent = true
          }
  
          if (plugin.feed) {
            plugin.feed = {
              ev: 'bh_feed',
              feed_id: plugin.feed_id,
              page_id: config.page_id,
              data: plugin.feed
            }
            Utils.Http.post(config.api_server + 'tr/', plugin.feed)
            plugin.sent = true
          }
        },
        resetMessengerCheckboxReceipt: function(data) {
          var MessengerCheckbox = Utils.getPlugin('fb-messenger-checkbox')
          if (!MessengerCheckbox) return
          MessengerCheckbox.removeAttribute('fb-iframe-plugin-query')
          plugins.messenger_checkbox.receipt = data
          plugins.messenger_checkbox.receipt_id = ''
          BOTHUB.Plugins.initMessengerCheckbox()
          window.FB.XFBML.parse()
          plugins.messenger_checkbox.sent = false
        },
        resetSendToMessengerReceipt: function(data) {
          var type = data.ev === 'bh_receipt' ? 'receipt' : 'feed'
          var sendToMessenger = Utils.getPlugin('fb-send-to-messenger')
          if (!sendToMessenger) return
          sendToMessenger.removeAttribute('fb-iframe-plugin-query')
          plugins.send_to_messenger[type] = data
          plugins.send_to_messenger[type + '_id'] = ''
          BOTHUB.Plugins.initSendToMessenger()
          window.FB.XFBML.parse()
          plugins.send_to_messenger.sent = false
        },
        resetSendToMessengerFeed: function(data) {
          plugins.send_to_messenger.receipt = ''
          plugins.send_to_messenger.receipt_id = ''
          this.resetSendToMessengerReceipt(data)
        }
      }
    }

    this.ECommerce = ECommerce = new ECommerce()

    var Plugins = function() {
      var messenger_checkbox = Utils.getPlugin('fb-messenger-checkbox')
      var send_to_messenger = Utils.getPlugin('fb-send-to-messenger')
      var messageus = Utils.getPlugin('fb-messengermessageus')
      var customerchat = Utils.getPlugin('fb-customerchat')
      var entrance = config.entrance

      return {
        initMessengerCheckbox: function() {
          if (messenger_checkbox) {
            entrance.fb_messenger_checkbox_ref = entrance.fb_messenger_checkbox_ref || {}
            
            if (ECommerce.plugins.messenger_checkbox.receipt) {
              Object.assign(entrance.fb_messenger_checkbox_ref, {
                receipt_id: ECommerce.getReceiptId('messenger_checkbox')
              })
            }

            Messenger.user_ref = Utils.getUserRef(true)
  
            for (var key in Messenger) {
              messenger_checkbox.setAttribute(key, Messenger[key])
            }
          } else {
            Messenger.user_ref = Utils.getUserRef()
          }
        },

        initSendToMessenger: function() {
          if (!send_to_messenger) return
  
          send_to_messenger.setAttribute('messenger_app_id', Messenger.messenger_app_id)
          send_to_messenger.setAttribute('page_id', Messenger.page_id)
  
          var dataRef = entrance.fb_send_to_messenger_data_ref || {}
  
          if (dataRef.length) {
            dataRef = JSON.parse(atob(dataRef.replace('base64:', '')))
            delete dataRef.receipt_id
            delete dataRef.feed_id
          }
  
          if (ECommerce.plugins.send_to_messenger.receipt) {
            dataRef.receipt_id = ECommerce.getReceiptId('send_to_messenger')
          }
  
          if (!dataRef.receipt_id && ECommerce.plugins.send_to_messenger.feed) {
            dataRef.feed_id = ECommerce.getFeedId('send_to_messenger')
          }
  
          dataRef = 'base64:' + btoa(JSON.stringify(dataRef))
  
          // dataRef not empty {}
          if (dataRef !== 'base64:e30=') {
            send_to_messenger.setAttribute('data-ref', dataRef)
          }
        },

        initMessageUs: function() {
          if (!messageus) return
          messageus.setAttribute('messenger_app_id', Messenger.messenger_app_id)
          messageus.setAttribute('page_id', Messenger.page_id)
        },

        initCustomerChat: function() {
          if (!customerchat) return
          customerchat.setAttribute('page_id', Messenger.page_id)
          if (entrance.fb_customerchat_ref) {
            customerchat.setAttribute('ref', entrance.fb_customerchat_ref)
          }
        }
      }
    }
    
    this.Plugins = new Plugins()
    this.Plugins.initMessengerCheckbox()
    this.Plugins.initSendToMessenger()
    this.Plugins.initMessageUs()
    this.Plugins.initCustomerChat()
  }

  if (!(BOTHUB && BOTHUB.Messenger)) {
    window.BOTHUB = new BotHub()
    
    var fbAsyncInitPrev = window.fbAsyncInit

    if (platforms.indexOf('facebook') > -1) {
      window.fbAsyncInit = function() {
        Utils.log('facebook sdk loaded.')

        FB.init({
          appId: BOTHUB.Messenger.messenger_app_id,
          xfbml: true,
          version: 'v2.6'
        })

        FB.Event.subscribe('messenger_checkbox', function(e) {
          Utils.log('messenger_checkbox event:', e)
          if (e.event === 'rendered') {
            Utils.log('Messenger plugin was rendered')
            BOTHUB.ECommerce.sendToMessenger('messenger_checkbox')
          } else if (e.event === 'checkbox') {
            var checkboxState = e.state
            Utils.log('Checkbox state: ' + checkboxState)
          } else if (e.event === 'not_you') {
            Utils.log('User clicked not you')
          } else if (e.event === 'hidden') {
            Utils.log('Messenger plugin was hidden')
          }
        })

        FB.Event.subscribe('send_to_messenger', function(e) {
          Utils.log('send_to_messenger event:', e)
          if (e.event === 'rendered') {
            Utils.log('Send to messenger plugin was rendered')
            BOTHUB.ECommerce.sendToMessenger('send_to_messenger')
          } else if (e.event === 'clicked') {
            Utils.log('User clicked send to messenger')
          } else if (e.event === 'not_you') {
            Utils.log('User clicked not you')
          } else if (e.event === 'hidden') {
            Utils.log('Send to messenger plugin was hidden')
          }
        })

        window.bhAsyncInit && window.bhAsyncInit()

        if (fbAsyncInitPrev) {
          eval('window.oldCb = ' + fbAsyncInitPrev.toString().replace('xfbml', 'fbml'))
          window.oldCb()
        }
      }

      if (window.FB) window.fbAsyncInit()
    } else {
      window.fbAsyncInit = function() {
        window.bhAsyncInit && window.bhAsyncInit()
      }
    }

    Utils.loadFacebookSdk()
  }
})()
