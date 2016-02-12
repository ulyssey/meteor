import buildmessage from '../utils/buildmessage.js';
const buildPluginModule = require('./build-plugin.js');

class InputFile extends buildPluginModule.InputFile {
  constructor(source, options = {}) {
    super();

    this._source = source;
    this._arch = options.arch;
    this._minifiedFiles = [];
  }

  getContentsAsBuffer() {
    return this._source.contents();
  }
  getPathInPackage() {
    throw new Error("Compiled files don't belong to any package");
  }
  getPackageName() {
    return this._source.onDemand ? this._source.packageName : '';
  }
  getSourceHash() {
    return this._source.hash();
  }
  getOnDemand() {
    return !!this._source.onDemand;
  }
  getArch() {
    return this._arch;
  }

  error({message, sourcePath, line, column, func}) {
    const relPath = this.getPathInBundle();
    buildmessage.error(message || ('error minifying ' + relPath), {
      file: sourcePath || relPath,
      line: line ? line : undefined,
      column: column ? column : undefined,
      func: func ? func : undefined
    });
  }

  /**
   * @summary Returns the path of the compiled file in the bundle.
   * @memberof InputFile
   * @returns {String}
   */
  getPathInBundle() {
    return this._source.targetPath;
  }

  /**
   * @summary Returns the source-map associated with the file.
   * @memberof InputFile
   * @returns {String}
   */
  getSourceMap() {
    return this._source.sourceMap;
  }
}

export class JsFile extends InputFile {
  // - data
  // - sourceMap
  // - path
  // - hash?
  addJavaScript(options) {
    const self = this;
    self._minifiedFiles.push({
      packageName: self.getPackageName(),
      data: options.data,
      sourceMap: options.sourceMap,
      path: options.path,
      onDemand: self.getOnDemand()
    });
  }
}

export class CssFile extends InputFile {
  // - data
  // - sourceMap
  // - path
  // - hash?
  addStylesheet(options) {
    const self = this;
    self._minifiedFiles.push({
      packageName: self.getPackageName(),
      data: options.data,
      sourceMap: options.sourceMap,
      path: options.path,
      onDemand: self.getOnDemand()
    });
  }
}

