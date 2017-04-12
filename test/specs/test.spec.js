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
});

