/**
 * @{Project}     Ellipsis plugin
 * @{Description} jquery plugin that excerpt the text at dedecated lines or
 *                dedicated number of chars
 *
 * @{Author}      Mohamed Hassan
 * @{Author_url}  http://mohamedhassan.me
 * @{License}     MIT
 */
;(function($, window, document, undefined){
  'use strict';

  // check for jquery
  if(typeof $ === undefined)
    throw new Error('there is no jquery attached, Please include jQuery >= 2.x');

  // define the plugin name and the default options
  const PLUGIN_NAME = 'ellipsis';
  const VERSION     = '0.0.1';


  /**
   * the default options of Ellipsis
   * @type {Object}
   */
  const DEFAULTS = {
    type: 'lines',
    count: 3
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

      this.init();
    }



    /*=========================================================================
     * PUBLIC
     *========================================================================*/

    /**
     * Public init() initialize the plugin and do logical stuff
     */
    init() {
      this._excerptTillChar(this.options.count);
    }



    /*=========================================================================
     * private Methods
     *========================================================================*/
    _excerptTillChar(number) {
      this.element.html(this.text.slice(0, number) + '...')
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
      let options = {
        type: $element.data('type') || 'lines',
        count: $element.data('count') || 3
      };

      $element.ellipsis(options);
    });
  });

  /* strip-code */
  window.__ellipsis__ = Ellipsis;
  /* end-strip-code */

})(jQuery, window, document);
