## ellipsis

-------------------------------------------------------------------------------

simple jquery plugin that excert text depending on lines number or characters number.

[![Build Status](https://travis-ci.org/pencilpix/ellipsis.svg?branch=master)](https://travis-ci.org/pencilpix/ellipsis) [![Coverage Status](https://coveralls.io/repos/github/pencilpix/grid-gallery/badge.svg?branch=develop)](https://coveralls.io/github/pencilpix/grid-gallery?branch=develop) [![DevDependency Status](https://david-dm.org/pencilpix/ellipsis/dev-status.svg)](https://david-dm.org/pencilpix/ellipsis/?type=dev)

---------------------------------------------------------------------------------------------------
### installation.

1. download via using one of the following
    * direct download or clone from this repository.
    * via npm

    ```bash
      $ npm install --save jquery-ellipsis
    ```
    * via bower

    ```bash
      $ bower install --save ellipsis
    ```

2. `jquery >= 2.x` must be included then include ellipsis:

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

