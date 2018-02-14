/*!
 * {{className}}
 *
 * @author
 * @copyright
 */
import EstaticoModule from '../../assets/js/helpers/module';

class {{className}} extends EstaticoModule {
  constructor($element, data, options) {
    const defaultData = {
    };
    const defaultOptions = {
      domSelectors: {
        // item: '[data-$\{{{className}}.name}="item"]'
      },
      stateClasses: {
        // activated: 'is_activated'
      },
    };

    super($element, defaultData, defaultOptions, data, options);

    this.initUi();
    this.initEventListeners();
  }

  static get events() {
    return {
      // eventname: 'eventname.estatico.' + {{className}}
    };
  }

  /**
   * Initialisation of variables, which point to DOM elements
   */
  initUi() {
    // DOM element pointers
  }

  /**
   * Event listeners initialisation
   */
  initEventListeners() {
    // Event listeners
  }

  /**
   * Unbind events, remove data, custom teardown
   */
  destroy() {
    super.destroy();

    // Custom destroy actions go here
  }
}

export default {{className}};