export default function Plugin (Class) {
  function initPlugin (param) {
    const pluginName = param.name;
    const pluginOption = Class.options;
    const selectorName = pluginName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const dataSelectorName = `[data-${selectorName}]`;

    $.fn[pluginName] = function () {
      const self = this;
      const plugin = new param();
      plugin.$element = self;
      plugin.options = pluginOption;
      plugin.props = {};
      plugin.init();
    }

    !!$(dataSelectorName).length && $(dataSelectorName)[pluginName]();
  }

  return typeof Class === 'function' ? initPlugin(Class) : initPlugin;
}
