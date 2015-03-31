  /**
   * ---------------------------------------------
   * Public Method (getID)
   * ---------------------------------------------
   * @desc A shortcut for getElementById.
   * @param {string} title - The name of the id of the element to select.
   * @return {elem} A reference to element with the given id.
   */
  function getID(title) {

    debug.start('getID', title);
    debug.args('getID', title, 'string');

    return document.getElementById(title);
  }

  /**
   * ---------------------------------------------
   * Public Method (getTag)
   * ---------------------------------------------
   * @desc A shortcut for getElementsByTagName.
   * @param {string} title - The name of the tags to select.
   * @param {elem=} root - The root element to use.
   * @return {elems} References to the elements with the tag.
   */
  function getTag(title, root) {

    debug.start('getTag', title, root);
    debug.args('getTag', title, 'string', root, 'elem=');

    root = root || app.elems.root;

    return root.getElementsByTagName(title);
  }

  /**
   * ---------------------------------------------
   * Public Method (getClass)
   * ---------------------------------------------
   * @desc A shortcut for getElementsByClassName.
   * @param {string} title - The name of the class to select.
   * @param {elem=} root - The root element to use.
   * @return {elems} References to the elements with the class.
   */
  function getClass(title, root) {

    debug.start('getClass', title, root);
    debug.args('getClass', title, 'string', root, 'elem=');

    root = root || app.elems.root;

    return root.getElementsByClassName(title);
  }

  /**
   * ---------------------------------------------------
   * Public Method (checkType)
   * ---------------------------------------------------
   * @param {val} val - The value to be evaluated.
   * @param {string} type - The type to evaluate the value against. The
   *   optional types are 'string', 'number', 'boolean', 'object',
   *   'function', 'elem', 'undefined', 'array', 'strings', 'numbers',
   *   'booleans', 'objects', 'functions', 'arrays', 'elems', 'stringMap',
   *   'numberMap', 'booleanMap', 'objectMap', 'functionMap', 'arrayMap', and
   *   'elemMap'. Use '|' as the separator for multiple types (e.g.
   *   'strings|numbers'). Use '=' to indicate the value is optional (e.g.
   *   'array=' or 'string|number='). Use '!' to indicate that null is not a
   *   possibility (e.g. '!string').
   * @return {boolean} The evaluation result.
   */
  function checkType(val, type) {

    // Debugging vars
    var errorMsg, failCheck;
    debug.start('checkType', val, type);
    debug.args('checkType', types, 'string');
    // Error message for checking the type value of each input
    errorMsg = 'Error: A given type was the wrong value. The incorrect ';
    errorMsg += 'value was \'$$\'. See the docs for acceptable values.';

    /**
     * @type {strings}
     * @private
     */
    var types;

    type = type.toLowerCase().replace(/[^a-z\|\=\!]/g, '');

    types = ( /\|/.test(type) ) ? type.split('|') : [ type ];

    return types.some(function(/** string */ type) {
      /**
       * @type {string}
       * @private
       */
      var cleanType;

      cleanType = type.replace(/\!|\=/g, '');

      failCheck = !regexps.types.all.test(cleanType);
      debug.fail('checkType', failCheck, errorMsg, type);

      // Handle undefined val
      if (val === undefined) {
        type = type.replace(/\!/g, '');
        return /\=|^undefined$/.test(type);
      }
      else {

        // Evaluate null
        if (val === null) {
          return !(/\!/.test(type));
        }

        if (cleanType === 'undefined') {
          return false;
        }

        // Evaluate array types
        if ( regexps.types.arrays.test(cleanType) ) {

          if ( !Array.isArray(val) ) {
            return false;
          }

          // Evaluate a basic array
          if (cleanType === 'array') {
            return true;
          }

          // Evaluate an array of arrays
          if (cleanType === 'arrays') {
            return val.every(function(subVal) {
              return ( Array.isArray(subVal) );
            });
          }

          // Evaluate an array of elements
          if (cleanType === 'elems') {
            return val.every(function(subVal) {
              return (subVal instanceof HTMLElement);
            });
          }

          // Evaluate each value of the array
          cleanType = cleanType.replace(/s$/, '');
          return val.every(function(subVal) {
            return (typeof subVal === cleanType);
          });
        }

        // Evaluate element
        if (cleanType === 'elem') {
          return (val instanceof HTMLElement);
        }

        // Evaluate string, number, boolean, object, and function types
        if ( regexps.types.basic.test(cleanType) ) {
          return (typeof val === cleanType);
        }

        // Evaluate hash map types
        if ( regexps.types.maps.test(cleanType) ) {

          if (typeof val !== 'object') {
            return false;
          }

          // Evaluate a hash map of arrays
          if (cleanType === 'arrayMap') {
            return Object.keys(val).every(function(subVal) {
              return ( Array.isArray(val[ subVal ]) );
            });
          }

          // Evaluate a hash map of elements
          if (cleanType === 'elemMap') {
            return Object.keys(val).every(function(subVal) {
              return (val[ subVal ] instanceof HTMLElement);
            });
          }

          // Evaluate each value of the hash map
          cleanType = cleanType.replace(/Map$/, '');
          return Object.keys(val).every(function(subVal) {
            return (typeof val[ subVal ] === cleanType);
          });
        }
      }

      return false;
    });
  }

  /**
   * ---------------------------------------------------
   * Public Method (checkTypes)
   * ---------------------------------------------------
   * @param {vals} vals - An array of the value(s) to be evaluated.
   *   Note that the values must be provided in an array.
   * @param {(string|strings)} types - The type(s) to evaluate the value(s)
   *   against. The optional types are 'string', 'number', 'boolean', 'object',
   *   'function', 'elem', 'undefined', 'array', 'strings', 'numbers',
   *   'booleans', 'objects', 'functions', 'arrays', 'elems', 'stringMap',
   *   'numberMap', 'booleanMap', 'objectMap', 'functionMap', 'arrayMap', and
   *   'elemMap'. Use '|' as the separator for multiple types (e.g.
   *   'strings|numbers'). Use '=' to indicate the value is optional (e.g.
   *   'array=' or 'string|number='). Use '!' to indicate that null is not a
   *   possibility (e.g. '!string').
   * @return {boolean} The evaluation result.
   */
  function checkTypes(vals, types) {

    // Debugging vars
    var errorMsg, failCheck;
    debug.start('checkType', vals, types);
    debug.args('checkType', vals, 'array', types, 'string|strings');

    /**
     * @type {val}
     * @private
     */
    var val;

    if (typeof types === 'string') {
      types = vals.map(function() {
        return types;
      });
    }

    errorMsg = 'Error: The length of the arguments to be checked ';
    errorMsg += 'were not the same. vals= $$, types= $$';
    failCheck = (vals.length !== types.length);
    debug.fail('checkType', failCheck, errorMsg, vals, types);

    // Error message for checking the type value of each input
    errorMsg = 'Error: A given type was the wrong value. The incorrect ';
    errorMsg += 'value was \'$$\'. See the docs for acceptable values.';

    return types.every(function(/** string */ _type, /** number */ i) {
      /**
       * @type {strings}
       * @private
       */
      var _types;

      val = vals[i];
      _type = _type.toLowerCase().replace(/[^a-z\|\=\!]/g, '');
      _types = ( /\|/.test(_type) ) ? _type.split('|') : [ _type ];

      return _types.some(function(/** string */ type) {
        /**
         * @type {string}
         * @private
         */
        var cleanType;

        cleanType = type.replace(/\!|\=/g, '');

        failCheck = !regexps.types.all.test(cleanType);
        debug.fail('checkType', failCheck, errorMsg, type);

        // Handle undefined val
        if (val === undefined) {
          type = type.replace(/\!/g, '');
          return /\=|^undefined$/.test(type);
        }
        else {

          // Evaluate null
          if (val === null) {
            return !(/\!/.test(type));
          }

          if (cleanType === 'undefined') {
            return false;
          }

          // Evaluate array types
          if ( regexps.types.arrays.test(cleanType) ) {

            if ( !Array.isArray(val) ) {
              return false;
            }

            // Evaluate a basic array
            if (cleanType === 'array') {
              return true;
            }

            // Evaluate an array of arrays
            if (cleanType === 'arrays') {
              return val.every(function(subVal) {
                return ( Array.isArray(subVal) );
              });
            }

            // Evaluate an array of elements
            if (cleanType === 'elems') {
              return val.every(function(subVal) {
                return (subVal instanceof HTMLElement);
              });
            }

            // Evaluate each value of the array
            cleanType = cleanType.replace(/s$/, '');
            return val.every(function(subVal) {
              return (typeof subVal === cleanType);
            });
          }

          // Evaluate element
          if (cleanType === 'elem') {
            return (val instanceof HTMLElement);
          }

          // Evaluate string, number, boolean, object, and function types
          if ( regexps.types.basic.test(cleanType) ) {
            return (typeof val === cleanType);
          }

          // Evaluate hash map types
          if ( regexps.types.maps.test(cleanType) ) {

            if (typeof val !== 'object') {
              return false;
            }

            // Evaluate a hash map of arrays
            if (cleanType === 'arrayMap') {
              return Object.keys(val).every(function(subVal) {
                return ( Array.isArray(val[ subVal ]) );
              });
            }

            // Evaluate a hash map of elements
            if (cleanType === 'elemMap') {
              return Object.keys(val).every(function(subVal) {
                return (val[ subVal ] instanceof HTMLElement);
              });
            }

            // Evaluate each value of the hash map
            cleanType = cleanType.replace(/Map$/, '');
            return Object.keys(val).every(function(subVal) {
              return (typeof val[ subVal ] === cleanType);
            });
          }
        }

        return false;
      });
    });
  }

  /**
   * ---------------------------------------------------
   * Public Method (sortKeys)
   * ---------------------------------------------------
   * @desc A helper method that sorts the keys of an object.
   * @param {strings} ids - The unsorted keys.
   * @param {stringMap} data - A hash map of ids and names.
   * @return {strings} The sorted keys.
   */
  function sortKeys(ids, data) {

    debug.start('sortKeys', ids, data);
    debug.args('sortKeys', ids, 'strings', data, 'stringMap');

    /**
     * @type {strings}
     * @private
     */
    var keys;
    /**
     * @type {strings}
     * @private
     */
    var names;
    /**
     * @type {string}
     * @private
     */
    var name;
    /**
     * @type {num}
     * @private
     */
    var id;
    /**
     * @type {num}
     * @private
     */
    var len;
    /**
     * @type {num}
     * @private
     */
    var ii;

    keys  = [];
    names = [];

    // Add the first key and its name to keys and names
    i    = ids.length - 1;
    id   = ids[i];
    name = data[id].toLowerCase();

    keys.push(id);
    names.push(name);

    // Add the remaining keys and their names in order
    ++i;
    while (i--) {
      id   = ids[i];
      name = data[id].toLowerCase();

      // The sorting logic (pre-sorted keys get linear time)
      len = names.length;
      ii  = 0;
      while (true) {

        if (ii === len) {
          keys.push(id);
          names.push(name);
          break;
        }

        if (name <= names[ii]) {
          keys.splice(ii, 0, id);
          names.splice(ii, 0, name);
          break;
        }

        ++ii;
      }
    }

    return keys;
  }

  /**
   * ---------------------------------------------------
   * Public Method (capFirst)
   * ---------------------------------------------------
   * @desc A helper method that capitalizes the first letter of a string.
   * @param {string} str - The original string.
   * @return {string} The capitalized string.
   */
  function capFirst(str) {

    debug.start('capFirst', str);
    debug.args('capFirst', str, 'string');

    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * ---------------------------------------------------
   * Public Method (camelCase)
   * ---------------------------------------------------
   * @desc A helper method that converts a string with dashes to
   *   camel case (e.g. 'example-case' to 'exampleCase').
   * @param {string} str - The original string.
   * @return {string} The camel case string.
   */
  function camelCase(str) {

    debug.start('camelCase', str);
    debug.args('camelCase', str, 'string');

    /**
     * @type {strings}
     * @private
     */
    var arr;
    /**
     * @type {num}
     * @private
     */
    var i;

    arr = str.split('-');

    // Capitalize the first letter in every word (except the first one)
    i = arr.length;
    while (--i) {
      arr[i] = capFirst(arr[i]);
    }

    return arr.join('');
  }