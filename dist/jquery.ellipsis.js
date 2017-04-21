var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @Project     Ellipsis plugin
 * @Description jquery plugin that excerpt the text at dedecated lines or
 *              dedicated number of chars
 *
 * @Author      Mohamed Hassan
 * @Author_url  http://mohamedhassan.me
 * @License     MIT
 */
;(function ($, window, document, undefined) {
  'use strict';
  // define the plugin name and the default options

  var PLUGIN_NAME = 'ellipsis';
  var VERSION = '0.1.6';

  /**
   * the default options of Ellipsis
   * @type {Object}
   */
  var DEFAULTS = {
    type: 'lines',
    count: 3
  };

  /**
   * different custom events shoud
   * @type { Object }
   */
  var EVENTS = {
    namespace: 'ellispsis',
    initialize: 'initialize.ellipsis',
    initialized: 'initialized.ellipsis',
    update: 'update.ellipsis',
    updated: 'updated.ellipsis',
    excerpt: 'excerpt.ellipsis',
    excerpted: 'excerpted.ellipsis'
  };

  /**
   * Ellipsis class that excerpt the text of an attached element depending
   * on number of lines / characters
   * @param  {HTMLElement} element   attached element to excerpt it's text
   * @param  {Object}      options   list of custom options
   */

  var Ellipsis = function () {
    function Ellipsis(element) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Ellipsis);

      this.element = $(element);
      this.options = Object.assign({}, Ellipsis.DEFAULTS, options);
      this.text = this.element.text();
      this._resizeTimeout = null;
      this._resizeHandler = this._updateOnResize.bind(this);

      this.init();
    }

    /*=========================================================================
     * PUBLIC
     *========================================================================*/

    /**
     * Public init() initialize the plugin and do logical stuff
     */


    _createClass(Ellipsis, [{
      key: 'init',
      value: function init() {
        this.element.trigger(EVENTS.initialize);

        this.element.trigger(EVENTS.excerpt);
        if (this.options.type === 'lines') {
          this._excerptLines(this.options.count);
        } else {
          this._excerptChars(this.options.count);
        }

        if (this.options.type === 'lines') {
          $(window).on('resize', this.element.selector, this._resizeHandler);
        }
        this.element.trigger(EVENTS.initialized);
      }

      /**
       * updating the ellipsed text.
       */

    }, {
      key: 'update',
      value: function update() {
        this.element.trigger(EVENTS.update);

        if (this.options.type === 'lines') this._excerptLines(this.options.count);else this._excerptChars(this.options.count);

        //later
        this.element.trigger(EVENTS.updated);
        return true;
      }

      /**
       * reset ellipsis instance options
       * if any change is needed later.
       *
       * @param {Object} options text/type/count.
       */

    }, {
      key: 'reset',
      value: function reset(options) {
        if (options.text) this.text = options.text;
        if (options.type) this.options.type = options.type;
        if (options.count) this.options.count = options.count;

        if (Object.keys(options).length > 0) {
          this.element.text(this.text);
          this.update();
        }
      }
    }, {
      key: 'destroy',
      value: function destroy() {
        $(window).off('resize', this._resizeHandler);
        this.element.text(this.text);
        this.element.off(EVENTS.namespace);
      }

      /*=========================================================================
       * private Methods
       *========================================================================*/
      /**
       * excerpt the text and leave a dedicated number of chars.
       *
       * @param { Number } number the total number of chars should be in element
       */

    }, {
      key: '_excerptChars',
      value: function _excerptChars(number) {
        if (number <= 0) return new Error('Number of chars to be shown is equal to or less than zero !!');

        if (number >= this.text.length) return null;

        this.element.html(this.text.slice(0, number) + '...');
        this.element.trigger(EVENTS.excerpted);
        return true;
      }

      /**
       * excerpts the text and leave a dedicated
       * number of lines.
       *
       * @param { Number }  linesNo  positive number that represent lines no.
       */

    }, {
      key: '_excerptLines',
      value: function _excerptLines(linesNo) {
        var lineHeight = void 0;
        var originalHeight = this.element.text(this.text).height();
        var targetHeight = void 0;
        var start = 0;
        var end = this.text.length - 1;
        var middle = void 0;

        lineHeight = this.element.text('w').height();
        targetHeight = lineHeight * linesNo;

        if (originalHeight <= targetHeight) {
          this.element.text(this.text);
          return false;
        }

        while (start <= end) {
          middle = Math.floor((start + end) / 2);
          this.element.text(this.text.slice(0, middle));

          if (this.element.height() <= targetHeight) {
            start = middle + 1;
          } else {
            end = middle - 1;
          }
        }

        this.element.text(this.text.slice(0, middle - 3) + '...');
        this.element.trigger(EVENTS.excerpted);
        return true;
      }

      /**
       * handler that used to call update method
       * with a debounce period.
       */

    }, {
      key: '_updateOnResize',
      value: function _updateOnResize() {
        var _this = this;

        clearTimeout(this._resizeTimeout);

        this._resizeTimeout = setTimeout(function () {
          _this.update();
        }, 300);
      }

      /**========================================================================
       * GETTERS
       *========================================================================*/

    }], [{
      key: 'DEFAULTS',
      get: function get() {
        return Object.freeze(DEFAULTS);
      }
    }]);

    return Ellipsis;
  }();

  /**
   * extend JQuery fn and initialize the plugin
   * @param  {Object}   options   custom setting of Plugin
   * @return {Object<Plugin>}   instance of jquery Plugin
   */


  $.fn[PLUGIN_NAME] = function (options) {
    var args = arguments;

    if (options === undefined || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + PLUGIN_NAME)) {
          $.data(this, 'plugin_' + PLUGIN_NAME, new Ellipsis(this, options));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + PLUGIN_NAME);

        if (instance instanceof Ellipsis && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + PLUGIN_NAME, null);
        }
      });

      return returns !== undefined ? returns : this;
    }
  };

  // init the plugin on data attribute
  $(document).ready(function () {
    var elementsToEllipsis = $('[data-toggle="ellipsis"]');

    elementsToEllipsis.each(function (i, element) {
      var $element = $(element);
      var options = {};

      if ($element.data('type') !== undefined) options.type = $element.data('type');

      if ($element.data('count') !== undefined) options.count = $element.data('count');

      $element.ellipsis(options);
    });
  });

})(jQuery, window, document);
//# sourceMappingURL=jquery.ellipsis.js.map
