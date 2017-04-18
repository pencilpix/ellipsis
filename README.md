## ellipsis


simple jquery plugin that excerpts text depending on __lines__  or __characters__ number.

[![Build Status](https://travis-ci.org/pencilpix/ellipsis.svg?branch=master)](https://travis-ci.org/pencilpix/ellipsis) [![Coverage Status](https://coveralls.io/repos/github/pencilpix/ellipsis/badge.svg?branch=develop)](https://coveralls.io/github/pencilpix/ellipsis?branch=develop) [![DevDependency Status](https://david-dm.org/pencilpix/ellipsis/dev-status.svg)](https://david-dm.org/pencilpix/ellipsis/?type=dev)

---------------------------------------------------------------------------------------------------
### installation.

1. Download using one of the following Methods
    * direct download or clone from this repository.
    * via npm

    ```bash
      $ npm install --save jquery-ellipsis
    ```
    * via bower

    ```bash
      $ bower install --save ellipsis
    ```

2. please be sure to include`jquery >= 2.x` then include ellipsis:

    ```html
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
    <script src="path/to/jquery.ellipsis.min.js"></script>
    ```

------------------------------------------------------------------------------------------------------
### Usage
ellipsis can be used in two different ways:

1. via `data` attributes.

    ```html
      <p data-toggle="ellipsis" data-type="chars" data-count="150"> Amet id nisi ipsa pariatur eaque aperiam dolorum eius quia, vero provident? Doloremque impedit at cupiditate illum magnam, quo, vel corrupti. Esse voluptates hic vitae porro temporibus temporibus! Possimus rem.</p>
    ```


2. manual way:

    ```html
    <p id="ellipsis_me">Amet id nisi ipsa pariatur eaque aperiam dolorum eius quia, vero provident? Doloremque impedit at cupiditate illum magnam, quo, vel corrupti. Esse voluptates hic vitae porro temporibus temporibus! Possimus rem.</p>

    <script>
    $(document).ready(function() {
      $('#ellipsis_me').ellipsis(options);
    });
    </script>
    ```



---------------------------------------------------------------------------------------------------------------
### options

option     | type    | value
-----------|---------|--------------------------------------------------------------------------------------
type       | String  | determines type is whether`chars` or `lines` number that the text should be excerpted.
count      | Number  | determines the number of `chars` or `lines` should the text be excerpted.


### events

event                  | when
-----------------------|-----------------------------------------------------------------------------------------------
initialize.ellipsis    | before the initialization of the plugin
initialized.ellipsis   | after the initialization.
excerpt.ellipsis       | before excerpt the text
excerpted.ellipsis     | after the text being excerpted
update.ellipsis        | before updating when window is resized
updated.ellipsis       | after updating.


#### example:
  ```js
  $('#paragraph').on('initialize.ellipsis', function() {
    // do some stuff
  });
  ```



---------------------------------------------------------------------------------------------------------------
### Features:
- [x] enhance the puplic API
    - [x] two different types of excerpts by lines/characters
    - [x] Support re-adjust option later.
    - [x] different custom event through the life cycle of the plugin.
    - [x] Destroyable.
    - [x] data attribute automatic init.

    - [ ] Up comming!
        - [ ] use dedicated word instead of `...`
        - [ ] use url to show more.
        - [ ] use link class to control the style of link.

