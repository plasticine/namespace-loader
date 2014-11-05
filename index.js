var path = require('path');

var FOOTER = "/*** EXPORTS FROM namespace-loader ***/\n";

var toCamelCase = function toCamelCase(input) {
  return input.toLowerCase()
              .charAt(0)
              .toUpperCase()
              .concat(input.slice(1))
              .replace(/_(.)/g, function(match, group1) {
                return group1.toUpperCase();
              });
};

var convertResourceToNamespaceStrings = function(resource) {
  return resource.split(path.sep).map(function(subPath, index, subPaths){
    var namespace = [ 'global' ];
    subPaths.slice(0, index + 1).forEach(function(subPath){
      if (index + 1 === subPaths.length) {
        subPath = path.basename(subPath, path.extname(subPath));
      }
      namespace.push(toCamelCase(subPath))
    });
    return namespace.join('.')
  });
};

var convertNamespaceStringToDeclaration = function(ns) {
  return [ ns, '=', ns, '||', '{};' ].join(' ');
};

module.exports = function() {};
module.exports = function(content) {
  this.cacheable && this.cacheable();
  var relativeRsourcePath = path.relative(this.options.context, this.resourcePath);
  var nameSpaceStrings = convertResourceToNamespaceStrings(relativeRsourcePath);
  var namespace = [
    nameSpaceStrings.slice(0, nameSpaceStrings.length - 1).reduce(function(memo, item){
      return memo.concat(convertNamespaceStringToDeclaration(item))
    }, ''),
    nameSpaceStrings.slice(-1).toString().concat(' = module.exports;'),
  ]
  return content + "\n\n" + FOOTER + namespace.join("\n");
};
