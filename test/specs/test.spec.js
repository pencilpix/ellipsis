/**
 * SENARIOS:
 * 1- use data attribute to setup the ellipsis plugin for lines:
 *    a- type lines and count is suitable num
 *    b- type lines and count is 0
 *    c- type lines and count is bigger that 10 which it's huge to excerpt
 *
 * 2- use data attribute to setup the ellipsis plugin for Chars:
 *    a- type chars and count is suitable num
 *    b- type chars and count is 0
 *    c- type chars and count is bigger that 500 which it's huge to excerpt
 *    d- type chars and count is less than 10 whch it's a small to excerpt
 *
 * 3- make sure the manual setup is working for each case.
 */
describe('Ellipsis', () => {
  it('should be defined', () => {
    expect($.fn.ellipsis).toBeDefined();
  });


  describe('generic', () => {

    let text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.`

    beforeEach(() => {
      $('body').append(`<p id="paragraph" style="width: 200px">${text}</p>`);
    });


    afterEach(() => {
      $('#paragraph').remove();
    });

    it('should excerpt text of p and leave only 150 chars without the ...', () => {
      $('#paragraph').ellipsis({type: 'chars', count: 150});
      expect($('#paragraph').text().length).toEqual(153);
    });

    it('should leave only 3 lines', () => {
      let $p = $('#paragraph');
      let expectedHeight = 0;
      $p.append('<span class="height-span">x</span>');
      expectedHeight = $('.height-span').height() * 3;
      $('.height-span').remove();

      $('#paragraph').ellipsis({type: 'lines', count: 3});
      expect($('#paragraph').height()).toEqual(expectedHeight);
    });


    it('should not excerpt the text if it\'s less than 2 lines', () => {
      let $p = $('#paragraph');
      let expectedText = '';
      let expectedHeight = 0;
      $p.append('<span class="height-span">x</span>');
      expectedHeight = $('.height-span').height();
      $('.height-span').remove();

      $('#paragraph').text(text.slice(0, 16));
      expectedText = text.slice(0, 16)

      $('#paragraph').ellipsis({type: 'lines', count: 2});
      expect($('#paragraph').height()).toEqual(expectedHeight);
      expect($('#paragraph').text()).toEqual(expectedText);
    });

    it('should not excerpt the text if text length less than dedicated lines count chars', () => {
      let $p = $('#paragraph');
      let expectedText = '';
      let expectedHeight = 0;
      $p.append('<span class="height-span">x</span>');
      expectedHeight = $('.height-span').height() * 2;
      $('.height-span').remove();

      $('#paragraph').text(text.slice(0, 34));
      expectedText = text.slice(0, 34)

      $('#paragraph').ellipsis({type: 'lines', count: 2});
      expect($('#paragraph').height()).toEqual(expectedHeight);
      expect($('#paragraph').text()).toEqual(expectedText);
    });


    it('should emit ellipsis custom events in different positions', (done) => {
      let initialize  = 0;
      let initialized = 0;
      let update      = 0;
      let updated     = 0;
      let excerpt     = 0;
      let excerpted   = 0;

      $('#paragraph').on('initialize.ellipsis', () => initialize = 1);
      $('#paragraph').on('initialized.ellipsis', () => initialized = 1);
      $('#paragraph').on('update.ellipsis', () => update = 1);
      $('#paragraph').on('updated.ellipsis', () => updated = 1);
      $('#paragraph').on('excerpt.ellipsis', () => excerpt = 1);
      $('#paragraph').on('excerpted.ellipsis', () => excerpted = 1);



      $('#paragraph').ellipsis({type: 'lines', count: 2});

      $('#paragraph').ellipsis('update');

      setTimeout(() => {
        expect(initialize).toBe(1, 'should initialize');
        expect(initialized).toBe(1, 'should initialized');
        expect(update).toBe(1, 'should update');
        expect(updated).toBe(1, 'should updated');
        expect(excerpt).toBe(1, 'should excerpt');
        expect(excerpted).toBe(1, 'should excerpted');
        done();
      }, 100)
    });


    it('should be destroyable', (done) => {
      let value = 0;

      $('#paragraph').on('ellipsis.update', () => value = 1);
      $('#paragraph').ellipsis({type: 'lines', count: 2});
      $('#paragraph').ellipsis('destroy');
      $(window).trigger('resize');

      setTimeout(() => {
        expect(value).toBe(0);
        expect($('#paragraph').text()).toEqual(text);
        done();
      }, 400)
    });

    it('should update options and excerpt text relative to changes', () => {
      $('#paragraph').ellipsis({type: 'lines', count: 2});
      $('#paragraph').ellipsis('reset', {text: 'text changed', type: 'chars', count: 11});

      expect($('#paragraph').text()).toEqual('text change...');
      expect($('#paragraph').text().length).toEqual(14);
    });
  });


  describe('Methods', () => {
    const Ellipsis = window.__ellipsis__;
    let text = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco
laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
dolor in reprehenderit in voluptate velit esse cillum dolore eu
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
sunt in culpa qui officia deserunt mollit anim id est laborum.`

    beforeEach(() => {
      $('body').append(`<p id="paragraph">${text}</p>`);
      $('#paragraph').css({
        lineHeight: '24px',
        width: '200px'
      });
    });


    afterEach(() => {
      $('#paragraph').remove();
    });


    it('should be initalized', () => {
      let options = {
          type: 'lines',
          count: 4
        };
      let p = document.querySelector('#paragraph');
      let x = new Ellipsis(p, options);

      expect(x.element).toEqual($(p));
      expect(x.text).toEqual(text);
      expect(x.options).toEqual(options);
    });

    describe('_excerptChars', () => {
      it('should excerpt till char at position: 30', () => {
        let options = { type: 'chars', count: 10 };
        let p = document.querySelector('#paragraph');
        let x = new Ellipsis(p, options);

        x._excerptChars(30);
        expect($(p).text().length).toEqual(33);
      });

      it('should through error when number of chars to be shown is negative', () => {
        let options = { type: 'chars', count: 10 };
        let p = document.querySelector('#paragraph');
        let x = new Ellipsis(p, options);

        let result = x._excerptChars(-1);
        expect(result instanceof Error).toBe(true);
      });

      it('should through error when number of chars to be shown is equal to 0', () => {
        let options = { type: 'chars', count: 10 };
        let p = document.querySelector('#paragraph');
        let x = new Ellipsis(p, options);

        let result = x._excerptChars(0);
        expect(result instanceof Error).toBe(true);
      });
    });

    describe('_excerptLines', () => {
      it('the height of element should not exceed the 4 lines height', () => {
        let options = { type: 'lines', count: 4 };
        let p = document.querySelector('#paragraph');
        let x = new Ellipsis(p, options);
        let pHeight = 0;

        x.element.text = text;
        x.text = text;

        pHeight = $(p).css('line-height').replace(/\D+/, '') * 4;
        expect($(p).height()).toEqual(pHeight);
      });
    });

  });

});

