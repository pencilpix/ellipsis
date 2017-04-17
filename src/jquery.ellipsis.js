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
  // define the plugin name and the default options
  const PLUGIN_NAME = 'ellipsis';
  const VERSION     = '0.1.2';


  /**
   * the default options of Ellipsis
   * @type {Object}
   */
  const DEFAULTS = {
    type: 'lines',
    count: 3
  };



  /**
   * the styles of span used to calculate height
   * of each line
   *
   * @type { Object }
   */
  const SPAN_CHAR_STYLE = {
    visibility: 'hidden',
    opacity: 1,
    display: 'block',
    position: 'absolute',
  }




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
      let result, charsNo;

      if(this.options.type === 'chars'){
        result = this._excerptTillChar(this.options.count);
      } else if(this.options.type === 'lines') {
        charsNo = this._getTotalCharsInLines(this.options.count);
        result = this._excerptTillChar(charsNo);
      }


      if(result instanceof Error){
        throw result;
      }


      if(this.options.type === 'lines') {
        $(window).on('resize', this._resizeHandler);
      }
    }



    /**
     * updating the ellipsed text.
     */
    update() {
      let number;

      if(this.options.type === 'lines') {
        number = this._getTotalCharsInLines(this.options.count)
      } else {
        number = this.options.count;
      }

      this._excerptTillChar(number);
    }



    /*=========================================================================
     * private Methods
     *========================================================================*/
    /**
     * excerpt the text and leave a dedicated number of chars.
     *
     * @param { Number } number the total number of chars should be in element
     */
    _excerptTillChar(number) {
      if(number <= 0)
        return new Error('Number of chars to be shown is equal to or less than zero !!');

      if(this.options.type === 'lines' && number >= 3)
        number -= 3;

      return this.element.html(this.text.slice(0, number) + '...')
    }



    /**
     * get the number of charters in dedicated
     * number of lines.
     *
     * @param { Number }  linesNo  positive number that represent lines no.
     * @return { Number } the total number of chars that could be in the lines.
     */
    _getTotalCharsInLines(linesNo) {
      let count = 0;
      let $charSpan;
      let spanId;
      let height;
      let charWidth;

      if(linesNo <= 0) {
        return 0;
      }

      spanId = 'ellipsis_char_' + this._getIdNo()
      this.element.append(`<span id="${spanId}" class="jquery_ellipsis">W</span>`);

      $charSpan = $('#' + spanId);
      $charSpan.css(SPAN_CHAR_STYLE);
      charWidth = $charSpan.width();
      count = linesNo * this.element.width() / charWidth;
      height = linesNo * $charSpan.height();


      $charSpan.text(this.text.slice(0, count));
      $charSpan.css('max-width', this.element.width());

      while($charSpan.height() <= height) {
        $charSpan.text(this.text.slice(0, $charSpan.text().length + 1));
      }

      count = $charSpan.text().length;
      $charSpan.remove();

      if(count && typeof count === 'number') count --;
      return count;
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



    /**
     * get unique id for each spn
     * that used for calculation
     */
    _getIdNo() {
      return $('jquery_ellipsis').length;
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
