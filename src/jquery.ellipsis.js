/**
 * @Project     Ellipsis plugin
 * @Description jquery plugin that excerpt the text at dedecated lines or
 *              dedicated number of chars
 *
 * @Author      Mohamed Hassan
 * @Author_url  http://mohamedhassan.me
 * @License     MIT
 */
;(function($, window, document, undefined){
  'use strict';
  // define the plugin name and the default options
  const PLUGIN_NAME = 'ellipsis';
  const VERSION     = '0.1.6';


  /**
   * the default options of Ellipsis
   * @type {Object}
   */
  const DEFAULTS = {
    type: 'lines',
    count: 3
  };



  /**
   * different custom events shoud
   * @type { Object }
   */
  const EVENTS = {
    namespace:   'ellispsis',
    initialize:  'initialize.ellipsis',
    initialized: 'initialized.ellipsis',
    update:      'update.ellipsis',
    updated:     'updated.ellipsis',
    excerpt:     'excerpt.ellipsis',
    excerpted:   'excerpted.ellipsis'
  };



  /**
   * Ellipsis class that excerpt the text of an attached element depending
   * on number of lines / characters
   * @param  {HTMLElement} element   attached element to excerpt it's text
   * @param  {Object}      options   list of custom options
   */
  class Ellipsis{
    constructor(element, options = {}) {
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
    init() {
      this.element.trigger(EVENTS.initialize);

      this.element.trigger(EVENTS.excerpt);
      if(this.options.type === 'lines') {
        this._excerptLines(this.options.count);
      } else {
        this._excerptChars(this.options.count);
      }

      if(this.options.type === 'lines') {
        $(window).on('resize', this.element.selector, this._resizeHandler);
      }
      this.element.trigger(EVENTS.initialized);
    }



    /**
     * updating the ellipsed text.
     */
    update() {
      this.element.trigger(EVENTS.update);

      if(this.options.type === 'lines')
        this._excerptLines(this.options.count);
      else
        this._excerptChars(this.options.count);

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
    reset(options) {
      if(options.text) this.text = options.text;
      if(options.type) this.options.type = options.type;
      if(options.count) this.options.count = options.count;

      if(Object.keys(options).length > 0) {
        this.element.text(this.text);
        this.update();
      }
    }



    destroy() {
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
    _excerptChars(number) {
      if(number <= 0)
        return new Error('Number of chars to be shown is equal to or less than zero !!');

      if(number >= this.text.length)
        return null;

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
    _excerptLines(linesNo) {
      let lineHeight;
      let originalHeight = this.element.text(this.text).height();
      let targetHeight;
      let start = 0;
      let end = this.text.length - 1;
      let middle;

      lineHeight = this.element.text('w').height();
      targetHeight = lineHeight * linesNo;

      if(originalHeight <= targetHeight) {
        this.element.text(this.text);
        return false;
      }

      while(start <= end) {
        middle = Math.floor((start + end) / 2);
        this.element.text(this.text.slice(0, middle));

        if(this.element.height() <= targetHeight) {
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
    _updateOnResize() {
      clearTimeout(this._resizeTimeout);

      this._resizeTimeout = setTimeout(() => {
        this.update();
      }, 300);
    }



    /**========================================================================
     * GETTERS
     *========================================================================*/
    static get DEFAULTS () {
      return Object.freeze(DEFAULTS);
    }

  }


  /**
   * extend JQuery fn and initialize the plugin
   * @param  {Object}   options   custom setting of Plugin
   * @return {Object<Plugin>}   instance of jquery Plugin
   */
  $.fn[PLUGIN_NAME] = function ( options ) {
    var args = arguments;

    if (options === undefined || typeof options === 'object') {
      return this.each(function () {
        if (!$.data(this, 'plugin_' + PLUGIN_NAME)) {
          $.data(this, 'plugin_' + PLUGIN_NAME, new Ellipsis( this, options ));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;

      this.each(function () {
        var instance = $.data(this, 'plugin_' + PLUGIN_NAME);

        if (instance instanceof Ellipsis && typeof instance[options] === 'function') {
          returns = instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + PLUGIN_NAME, null);
        }
      });

      return returns !== undefined ? returns : this;
    }
  };



  // init the plugin on data attribute
  $(document).ready(function() {
    let elementsToEllipsis = $('[data-toggle="ellipsis"]');

    elementsToEllipsis.each((i, element) => {
      let $element = $(element);
      let options = {};

      if( $element.data('type') !== undefined )
        options.type =  $element.data('type');

      if( $element.data('count') !== undefined )
        options.count = $element.data('count');

      $element.ellipsis(options);
    });
  });

  /* strip-code */
  window.__ellipsis__ = Ellipsis;
  /* end-strip-code */

})(jQuery, window, document);
