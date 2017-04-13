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
  it('it will be defined', () => {
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
  });

});

