  /**
   * -----------------------------------------------------
   * Public Variable (appModuleAPI)
   * -----------------------------------------------------
   * @desc Holds the app module's public properties and methods.
   * @type {!Object<string, function>}
   * @struct
   */
  var appModuleAPI = {};

  /**
   * -----------------------------------------------------
   * Public Method (appModuleAPI.startApp)
   * -----------------------------------------------------
   * @desc Initializes the app.
   * @param {Object} settings - The app's settings.
   */
  appModuleAPI.startApp = function(settings) {

    debug.start('startApp', settings);
    debug.args('startApp', settings, 'object');

    /** @type {?(string|strings)} */
    var resourceList;
    /** @type {objectMap} */
    var config;
    /** @type {stringMap} */
    var sources;
    /** @type {(objectMap|stringMap)} */
    var categories;
    /** @type {!objects} */
    var questions;
    /** @type {function} */
    var setup;
    /** @type {function} */
    var callback;
    /** @type {number} */
    var i;

    if (appHasBeenInitialized) {
      return;
    }

    // Save the init of this app to prevent second init
    appHasBeenInitialized = true;

    if ( !checkType(settings, '!object') ) {
      settings = {};
    }

    // Setup the app arguments
    resourceList = ( ( hasOwnProp(settings, 'resources') ) ?
      settings.resources : null
    );
    config = ( ( hasOwnProp(settings, 'config') ) ?
      settings.config : ( hasOwnProp(settings, 'configuration') ) ?
        settings.configuration : null
    );
    sources = ( ( hasOwnProp(settings, 'sources') ) ?
      settings.sources : ( hasOwnProp(settings, 'source') ) ?
        settings.source : null
    );
    categories = ( ( hasOwnProp(settings, 'categories') ) ?
      settings.categories : ( hasOwnProp(settings, 'category') ) ?
        settings.category : null
    );
    questions = ( ( hasOwnProp(settings, 'questions') ) ?
      settings.questions : ( hasOwnProp(settings, 'question') ) ?
        settings.question : []
    );

    logAppInitTypeErrors(resourceList, config, sources, categories, questions);

    // Check the types of the arguments
    if ( !checkType(resourceList, 'string|strings') ) {
      resourceList = null;
    }
    if ( !checkType(config, 'objectMap') ) {
      config = null;
    }
    if ( !checkType(sources, 'stringMap') ) {
      sources = null;
    }
    if ( !checkType(categories, 'stringMap|objectMap') ) {
      categories = null;
    }
    if ( !checkType(questions, '!objects') ) {
      questions = [];
    }

    // Setup and start the app
    setup = function() {
      freezeObj(resources);
      app = new App(config, sources, categories, questions);
      app.setupDisplay();
    };

    // Save the resources
    if (resourceList) {

      if ( checkType(resourceList, 'string') ) {
        getResource(resourceList, setup);
        return;
      }

      callback = setup;
      i = resourceList.length;
      while (--i) {
        callback = (function(jsonFile, callback) {         
          return function() {
            getResource(jsonFile, callback);
          };
        })(resourceList[i], callback);
      }
      getResource(resourceList[0], callback);
      return;
    }

    setup();
  };

  /**
   * -----------------------------------------------------
   * Public Method (appModuleAPI.getResource)
   * -----------------------------------------------------
   * @desc Makes the app's resources publically available.
   * @param {string=} prop - The specific resource to retrieve.
   * @return {*} Either the entire resources object or one of its properties.
   */
  appModuleAPI.getResource = function(prop) {

    debug.start('getResource', prop);
    debug.args('getResource', prop, 'string=');
    debug.state('getResource', 'resources= $$', resources);

    /** @type {string} */
    var errorMsg;
    /** @type {*} */
    var result;

    prop = prop || '';

    if (prop && !hasOwnProp(resources, prop)) {
      errorMsg = 'The resource you requested does not exist. Please verify that \'';
      errorMsg += prop + '\' is a correct json file name in the resources folder ';
      errorMsg += 'and that the file name was included in the setup of the app ';
      errorMsg += '(see algorithmiv.com/docs/resources).';
      console.error(errorMsg);
      debugger;
    }
    else {
      result = (!!prop) ? resources[ prop ] : resources;
    }

    debug.end('getResource', result);

    return result;
  }

  aIV.utils.freezeObj(appModuleAPI);
