var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @{Project}     Ellipsis plugin
 * @{Description} jquery plugin that excerpt the text at dedecated lines or
 *                dedicated number of chars
 *
 * @{Author}      Mohamed Hassan
 * @{Author_url}  http://mohamedhassan.me
 * @{License}     MIT
 */
;(function ($, window, document, undefined) {
  'use strict';
  // define the plugin name and the default options

  var PLUGIN_NAME = 'ellipsis';
  var VERSION = '0.1.5';

  /**
   * the default options of Ellipsis
   * @type {Object}
   */
  var DEFAULTS = {
    type: 'lines',
    count: 3
  };

  /**
   * the styles of span used to calculate height
   * of each line
   *
   * @type { Object }
   */
  var SPAN_CHAR_STYLE = {
    visibility: 'hidden',
    opacity: 1,
    display: 'block',
    position: 'absolute'
  };

  /**
   * different custom events shoud
   * @type { Object }
   */
  var EVENTS = {
    namespace: '.ellispsis',
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
        var result = void 0,
            charsNo = void 0;

        this.element.trigger(EVENTS.initialize);

        if (this.options.type === 'chars') {
          result = this._excerptTillChar(this.options.count);
        } else if (this.options.type === 'lines') {
          charsNo = this._getTotalCharsInLines(this.options.count);
          if (charsNo) {
            this.element.trigger(EVENTS.excerpt);
            result = this._excerptTillChar(charsNo);
            this.element.trigger(EVENTS.excerpted);
          }
        }

        if (result instanceof Error) {
          throw result;
        }

        if (this.options.type === 'lines') {
          $(window).on('resize', this._resizeHandler);
        }
        this.element.trigger(EVENTS.initialized);
      }

      /**
       * updating the ellipsed text.
       */

    }, {
      key: 'update',
      value: function update() {
        var number = void 0;

        this.element.trigger(EVENTS.update);

        if (this.options.type === 'lines') {
          number = this._getTotalCharsInLines(this.options.count);
        } else {
          number = this.options.count;
        }

        this.element.trigger(EVENTS.excerpt);
        this._excerptTillChar(number);
        this.element.trigger(EVENTS.excerpted);

        this.element.trigger(EVENTS.updated);
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
      key: '_excerptTillChar',
      value: function _excerptTillChar(number) {

        if (number <= 0) return new Error('Number of chars to be shown is equal to or less than zero !!');

        if (this.options.type === 'lines' && number >= 3) number -= 3;

        if (number >= this.text.length) return null;

        return this.element.html(this.text.slice(0, number) + '...');
      }

      /**
       * get the number of characters in dedicated
       * number of lines.
       *
       * @param { Number }  linesNo  positive number that represent lines no.
       * @return { Number } the total number of chars that could be in the lines.
       */

    }, {
      key: '_getTotalCharsInLines',
      value: function _getTotalCharsInLines(linesNo) {
        var count = 0;
        var $charSpan = void 0;
        var spanId = void 0;
        var height = void 0;
        var charWidth = void 0;

        if (linesNo <= 0) {
          return 0;
        }

        spanId = 'ellipsis_char_' + this._getIdNo();
        this.element.append('<span id="' + spanId + '" class="jquery_ellipsis">W</span>');

        $charSpan = $('#' + spanId);
        $charSpan.css(SPAN_CHAR_STYLE);
        charWidth = $charSpan.width();
        count = linesNo * this.element.width() / charWidth;
        height = linesNo * $charSpan.height();

        if (count >= this.text.length) {
          $charSpan.remove();
          return null;
        }

        $charSpan.text(this.text.slice(0, count));
        $charSpan.css('max-width', this.element.width());

        while ($charSpan.height() <= height && this.text.length >= $charSpan.text().length + 1) {
          $charSpan.text(this.text.slice(0, $charSpan.text().length + 1));
        }

        count = $charSpan.text().length;

        $charSpan.remove();

        if (count >= this.text.length) {
          return null;
        }

        if (count && typeof count === 'number') count--;
        return count;
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

      /**
       * get unique id for each span
       * that used for calculation
       */

    }, {
      key: '_getIdNo',
      value: function _getIdNo() {
        return $('jquery_ellipsis').length;
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
