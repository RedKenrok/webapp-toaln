(() => {
  // node_modules/@doars/staark/dst/staark.js
  var arrayify = (data) => {
    var _a;
    return (_a = arrayifyOrUndefined(data)) != null ? _a : [];
  };
  var arrayifyOrUndefined = (data) => data ? Array.isArray(data) ? data : [data] : void 0;
  var conditional = (condition, onTruth, onFalse) => {
    let result = condition ? onTruth : onFalse;
    if (typeof result === "function") {
      result = result();
    }
    return arrayify(result);
  };
  var marker = "n";
  var node = (type, attributesOrContents, contents) => {
    if (typeof attributesOrContents !== "object" || attributesOrContents._ === marker || Array.isArray(attributesOrContents)) {
      contents = attributesOrContents;
      attributesOrContents = void 0;
    }
    return {
      _: marker,
      a: attributesOrContents,
      c: arrayifyOrUndefined(contents),
      t: type.toUpperCase()
    };
  };
  var factory = new Proxy({}, {
    get: (target, type) => {
      if (target[type]) {
        return target[type];
      }
      const typeConverted = (type[0] + type.substring(1).replace(
        /([A-Z])/g,
        (capital) => "-" + capital
      )).toUpperCase();
      return target[type] = (attributesOrContents, contents) => node(
        typeConverted,
        attributesOrContents,
        contents
      );
    }
  });
  var BRACKET_CLOSE = "]";
  var BRACKET_OPEN = "[";
  var DOT = ".";
  var EQUAL = "=";
  var HASH = "#";
  var QUOTE_SINGLE = "'";
  var QUOTE_DOUBLE = '"';
  var selectorToTokenizer = (selector) => {
    const length = selector.length;
    let i = 0;
    let type = "";
    const attributes = {};
    let tokenA = "";
    let tokenB = true;
    let tokenType = 3;
    const storeToken = () => {
      if (tokenA) {
        switch (tokenType) {
          case 0:
            attributes[tokenA] = tokenB === true ? true : tokenB;
            tokenB = true;
            break;
          case 1:
            if (!attributes.class) {
              attributes.class = tokenA;
              break;
            }
            attributes.class += " " + tokenA;
            break;
          case 2:
            attributes.id = tokenA;
            break;
          case 3:
            type = tokenA;
            break;
        }
        tokenA = "";
      }
    };
    let character;
    let attributeBracketCount;
    const parseAttribute = () => {
      attributeBracketCount = 0;
      while (i < length) {
        character = selector[i];
        i++;
        if (character === EQUAL) {
          tokenB = "";
          character = selector[i];
          const endOnDoubleQuote = character === QUOTE_DOUBLE;
          const endOnSingleQuote = character === QUOTE_SINGLE;
          if (endOnDoubleQuote || endOnSingleQuote) {
            tokenB += character;
            i++;
          }
          while (i < length) {
            character = selector[i];
            if (endOnDoubleQuote && character === QUOTE_DOUBLE || endOnSingleQuote && character === QUOTE_SINGLE) {
              tokenB += character;
              i++;
              break;
            } else if (!endOnDoubleQuote && !endOnSingleQuote && character === BRACKET_CLOSE) {
              break;
            }
            tokenB += character;
            i++;
          }
          if (tokenB[0] === QUOTE_DOUBLE && tokenB[tokenB.length - 1] === QUOTE_DOUBLE || tokenB[0] === QUOTE_SINGLE && tokenB[tokenB.length - 1] === QUOTE_SINGLE) {
            tokenB = tokenB.substring(1, tokenB.length - 1);
          }
          while (i < length) {
            character = selector[i];
            i++;
            if (character === BRACKET_CLOSE) {
              break;
            }
          }
          break;
        } else if (character === BRACKET_OPEN) {
          attributeBracketCount++;
          continue;
        } else if (character === BRACKET_CLOSE) {
          attributeBracketCount--;
          if (attributeBracketCount < 0) {
            break;
          }
          continue;
        }
        tokenA += character;
      }
      storeToken();
    };
    while (i < length) {
      character = selector[i];
      i++;
      if (character === HASH) {
        storeToken();
        tokenType = 2;
        continue;
      } else if (character === DOT) {
        storeToken();
        tokenType = 1;
        continue;
      } else if (character === BRACKET_OPEN) {
        storeToken();
        tokenType = 0;
        parseAttribute();
        continue;
      }
      tokenA += character;
    }
    return [type, attributes];
  };
  var fctory = new Proxy({}, {
    get: (target, type) => {
      if (target[type]) {
        return target[type];
      }
      const typeConverted = (type[0] + type.substring(1).replace(
        /([A-Z])/g,
        (capital) => "-" + capital
      )).toUpperCase();
      return target[type] = (selector, contents) => {
        let attributes;
        if (selector) {
          const [_, _attributes] = selectorToTokenizer(selector);
          attributes = _attributes;
        }
        return node(
          typeConverted,
          attributes,
          contents
        );
      };
    }
  });
  var match = (pattern, lookup, fallback) => {
    let result;
    if (lookup && pattern in lookup && lookup[pattern]) {
      result = lookup[pattern];
    } else {
      result = fallback;
    }
    if (typeof result === "function") {
      result = result();
    }
    return arrayify(result);
  };
  var cloneRecursive = (value) => {
    if (typeof value === "object") {
      const clone = Array.isArray(value) ? [] : {};
      for (const key in value) {
        clone[key] = cloneRecursive(value[key]);
      }
      return clone;
    }
    return value;
  };
  var equalRecursive = (valueA, valueB) => {
    if (valueA === valueB) {
      return true;
    }
    if (!valueA || !valueB || typeof valueA !== "object" || typeof valueB !== "object") {
      return valueA === valueB;
    }
    if (valueA instanceof Date) {
      return valueB instanceof Date && valueA.getTime() === valueB.getTime();
    }
    const keys = Object.keys(valueA);
    return keys.length === Object.keys(valueB).length && keys.every((k) => equalRecursive(valueA[k], valueB[k]));
  };
  var childrenToNodes = (element) => {
    var _a;
    const abstractChildNodes = [];
    for (const childNode of element.childNodes) {
      if (childNode instanceof Text) {
        abstractChildNodes.push(
          (_a = childNode.textContent) != null ? _a : ""
        );
      } else {
        const elementChild = childNode;
        const attributes = {};
        for (const attribute of elementChild.attributes) {
          attributes[attribute.name] = attribute.value;
        }
        abstractChildNodes.push(
          node(
            childNode.nodeName,
            attributes,
            childrenToNodes(childNode)
          )
        );
      }
    }
    return abstractChildNodes;
  };
  var proxify = (root, onChange) => {
    const handler = {
      deleteProperty: (target, key) => {
        if (Reflect.has(target, key)) {
          const deleted = Reflect.deleteProperty(target, key);
          if (deleted) {
            onChange();
          }
          return deleted;
        }
        return true;
      },
      set: (target, key, value) => {
        const existingValue = target[key];
        if (existingValue !== value) {
          if (value && typeof value === "object") {
            value = add(value);
          }
          target[key] = value;
          onChange();
        }
        return true;
      }
    };
    const add = (target) => {
      for (const key in target) {
        if (target[key] && typeof target[key] === "object") {
          target[key] = add(target[key]);
        }
      }
      return new Proxy(target, handler);
    };
    return add(root);
  };
  var mount = (rootElement, renderView, initialState, oldAbstractTree) => {
    if (typeof initialState === "string") {
      initialState = JSON.parse(initialState);
    }
    if (!initialState) {
      initialState = {};
    }
    let updatePromise = null;
    const triggerUpdate = () => {
      if (!updatePromise) {
        updatePromise = Promise.resolve().then(updateAbstracts);
      }
      return updatePromise;
    };
    let state = Object.getPrototypeOf(initialState) === Proxy.prototype ? initialState : proxify(
      initialState,
      triggerUpdate
    );
    const updateAttributes = (element, newAttributes, oldAttributes) => {
      if (newAttributes) {
        for (const name in newAttributes) {
          let value = newAttributes[name];
          if (value) {
            const type = typeof value;
            if (type === "function") {
              const oldValue = oldAttributes == null ? void 0 : oldAttributes[name];
              if ((oldValue == null ? void 0 : oldValue.f) !== value) {
                if (oldValue) {
                  element.removeEventListener(
                    name,
                    oldValue
                  );
                }
                const listener = newAttributes[name] = (event) => {
                  value(event, state);
                };
                listener.f = value;
                element.addEventListener(
                  name,
                  listener
                );
              }
            } else {
              if (name === "class") {
                if (typeof value === "object") {
                  if (Array.isArray(value)) {
                    value = value.join(" ");
                  } else {
                    let classNames = "";
                    for (const className in value) {
                      if (value[className]) {
                        classNames += " " + className;
                      }
                    }
                    value = classNames;
                  }
                }
                element.className = value;
              } else if (name === "style" && typeof value === "object") {
                for (let styleName in value) {
                  let styleValue = value[styleName];
                  if (styleName.includes("-", 1)) {
                    element.style.setProperty(
                      styleName,
                      styleValue
                    );
                  } else {
                    element.style[styleName] = styleValue;
                  }
                }
                if (oldAttributes && oldAttributes[name] && typeof oldAttributes[name] === "object" && !Array.isArray(oldAttributes[name])) {
                  for (let styleName in oldAttributes[name]) {
                    if (!(styleName in value)) {
                      if (styleName.includes("-")) {
                        element.style.removeProperty(
                          styleName
                        );
                      } else {
                        delete element.style[styleName];
                      }
                    }
                  }
                }
              } else {
                if (value === true) {
                  value = "true";
                } else if (type !== "string") {
                  value = value.toString();
                }
                element.setAttribute(name, value);
              }
            }
          }
        }
      }
      if (oldAttributes) {
        for (const name in oldAttributes) {
          const value = oldAttributes[name];
          if (!newAttributes || !newAttributes[name]) {
            if (typeof value === "function") {
              element.removeEventListener(
                name,
                oldAttributes[name]
              );
            } else if (name === "class") {
              element.className = "";
            } else if (name === "style") {
              element.style.cssText = "";
            } else if (name === "value") {
              element.value = "";
            } else {
              element.removeAttribute(name);
            }
          }
        }
      }
    };
    let oldMemoMap = /* @__PURE__ */ new WeakMap();
    let newMemoMap = /* @__PURE__ */ new WeakMap();
    const updateChildren = (element, newChildAbstracts, oldChildAbstracts) => {
      let newIndex = 0;
      let newCount = 0;
      if (newChildAbstracts) {
        for (; newIndex < newChildAbstracts.length; newIndex++) {
          const newAbstract = newChildAbstracts[newIndex];
          if (newAbstract.r) {
            let match2 = oldMemoMap.get(
              newAbstract.r
            );
            if (!match2 || !equalRecursive(match2.m, newAbstract.m)) {
              match2 = {
                c: arrayifyOrUndefined(
                  newAbstract.r(
                    state,
                    newAbstract.m
                  )
                ),
                m: newAbstract.m,
                r: newAbstract.r
              };
            }
            newMemoMap.set(newAbstract.r, match2);
            newChildAbstracts.splice(
              newIndex,
              1,
              ...cloneRecursive(
                match2.c
              )
            );
            newIndex--;
            continue;
          }
          let matched = false;
          if (oldChildAbstracts) {
            for (let oldIndex = newIndex - newCount; oldIndex < oldChildAbstracts.length; oldIndex++) {
              const oldAbstract = oldChildAbstracts[oldIndex];
              if (oldAbstract.t && newAbstract.t === oldAbstract.t || !oldAbstract.t && !newAbstract.t) {
                matched = true;
                if (newIndex !== oldIndex + newCount) {
                  element.insertBefore(
                    element.childNodes[oldIndex + newCount],
                    element.childNodes[newIndex]
                  );
                  oldChildAbstracts.splice(
                    newIndex - newCount,
                    0,
                    oldChildAbstracts.splice(
                      oldIndex,
                      1
                    )[0]
                  );
                }
                if (newAbstract.t) {
                  updateAttributes(
                    element.childNodes[newIndex],
                    newAbstract.a,
                    oldAbstract.a
                  );
                  updateChildren(
                    element.childNodes[newIndex],
                    newAbstract.c,
                    oldAbstract.c
                  );
                } else if (oldAbstract !== newAbstract) {
                  element.childNodes[newIndex].textContent = newAbstract;
                }
                break;
              }
            }
          }
          if (!matched) {
            let newNode;
            if (newAbstract.t) {
              newNode = document.createElement(
                newAbstract.t
              );
              updateAttributes(
                newNode,
                newAbstract.a
              );
              updateChildren(
                newNode,
                newAbstract.c
              );
            } else {
              newNode = document.createTextNode(
                newAbstract
              );
            }
            element.insertBefore(
              newNode,
              element.childNodes[newIndex]
            );
            newCount++;
          }
        }
      }
      if (oldChildAbstracts) {
        const elementLength = oldChildAbstracts.length + newCount;
        if (elementLength >= newIndex) {
          for (let i = elementLength - 1; i >= newIndex; i--) {
            element.childNodes[i].remove();
          }
        }
      }
    };
    const _rootElement = typeof rootElement === "string" ? document.querySelector(rootElement) || document.body.appendChild(
      document.createElement("div")
    ) : rootElement;
    if (typeof oldAbstractTree === "string") {
      try {
        oldAbstractTree = JSON.parse(oldAbstractTree);
      } catch (error) {
        oldAbstractTree = null;
      }
    }
    if (!oldAbstractTree) {
      oldAbstractTree = childrenToNodes(_rootElement);
    }
    let active = true, updating = false;
    const updateAbstracts = () => {
      if (active && !updating && updatePromise) {
        updating = true;
        updatePromise = null;
        let newAbstractTree = arrayifyOrUndefined(
          renderView(state)
        );
        updateChildren(
          _rootElement,
          newAbstractTree,
          oldAbstractTree
        );
        oldAbstractTree = newAbstractTree;
        oldMemoMap = newMemoMap;
        newMemoMap = /* @__PURE__ */ new WeakMap();
        updating = false;
      }
    };
    triggerUpdate();
    updateAbstracts();
    return [
      triggerUpdate,
      () => {
        if (active) {
          active = false;
          for (let i = _rootElement.childNodes.length - 1; i >= 0; i--) {
            _rootElement.childNodes[i].remove();
          }
        }
      },
      state
    ];
  };

  // src/utilities/registerSW.js
  navigator.serviceWorker.register("./sw.js", {
    scope: "./"
  });

  // node_modules/@doars/vroagn/dst/vroagn.js
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };
  var cloneRecursive2 = (value) => {
    if (typeof value === "object") {
      const clone = Array.isArray(value) ? [] : {};
      for (const key in value) {
        clone[key] = cloneRecursive2(value[key]);
      }
      return clone;
    }
    return value;
  };
  var delay = (time) => __async(void 0, null, function* () {
    if (time > 0) {
      return new Promise(
        (resolve) => setTimeout(resolve, time)
      );
    }
    return null;
  });
  var normalizeContentType = (contentType) => contentType.split(";")[0].trim().toLowerCase();
  var getFileExtension = (url) => {
    const match2 = url.match(/\.([^./?]+)(?:[?#]|$)/);
    return match2 ? match2[1].toLowerCase() : null;
  };
  var getType = function(url, responseHeaders, requestHeaders) {
    const contentType = responseHeaders.get("Content-Type");
    if (contentType) {
      return normalizeContentType(contentType);
    }
    if (requestHeaders) {
      if (requestHeaders["Accept"]) {
        const acceptTypes = requestHeaders["Accept"].split(",");
        for (const type of acceptTypes) {
          if (type.trim() !== "*/*") {
            return normalizeContentType(type);
          }
        }
      }
    }
    const extension = getFileExtension(url);
    if (extension) {
      return extension;
    }
    return "";
  };
  var DEFAULT_VALUES = {
    method: "get",
    retryCodes: [429, 503, 504],
    retryDelay: 500
  };
  var create = (initialOptions) => {
    initialOptions = __spreadValues(__spreadValues({}, DEFAULT_VALUES), cloneRecursive2(initialOptions));
    let lastExecutionTime = 0;
    let activeRequests = 0;
    let totalRequests = 0;
    let debounceTimeout = null;
    const throttle = (throttleValue) => __async(void 0, null, function* () {
      const now = Date.now();
      const waitTime = throttleValue - (now - lastExecutionTime);
      lastExecutionTime = now + (waitTime > 0 ? waitTime : 0);
      yield delay(waitTime);
    });
    const debounce = (debounceValue) => {
      return new Promise((resolve) => {
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(
          resolve,
          debounceValue
        );
      });
    };
    const sendRequest = (options2) => __async(void 0, null, function* () {
      if (options2.maxRequests !== void 0 && totalRequests >= options2.maxRequests) {
        return [new Error("Maximum request limit reached"), null, null];
      }
      totalRequests++;
      const config = {
        cache: options2.cache,
        credentials: options2.credentials,
        headers: options2.headers,
        method: options2.method,
        mode: options2.mode,
        redirect: options2.redirect,
        body: options2.body ? JSON.stringify(options2.body) : void 0
      };
      let url = (options2.domain || "") + (options2.path || "");
      if (options2.queryParams) {
        url += "?" + new URLSearchParams(
          options2.queryParams
        ).toString();
      }
      if (options2.timeout) {
        const controller = options2.abort || new AbortController();
        config.signal = controller.signal;
        setTimeout(
          () => controller.abort(),
          options2.timeout
        );
      }
      const executeFetch = () => __async(void 0, null, function* () {
        var _a;
        const response2 = yield ((_a = options2.fetch) != null ? _a : fetch)(url, config);
        if (!response2.ok) {
          return [new Error("Invalid response"), response2, null];
        }
        try {
          let result2;
          let foundParser = false;
          const type = options2.type || getType(url, response2.headers, options2.headers);
          if (options2.parsers) {
            for (const parser of options2.parsers) {
              foundParser = parser.types.includes(type);
              if (foundParser) {
                result2 = yield parser.parser(
                  response2,
                  options2,
                  type
                );
                break;
              }
            }
          }
          if (!foundParser) {
            switch (type.toLowerCase()) {
              case "arraybuffer":
                result2 = yield response2.arrayBuffer();
                break;
              case "blob":
                result2 = yield response2.blob();
                break;
              case "formdata":
                result2 = yield response2.formData();
                break;
              case "text/plain":
              case "text":
              case "txt":
                result2 = yield response2.text();
                break;
              case "text/html-partial":
              case "html-partial":
                result2 = yield response2.text();
                const template = document.createElement("template");
                template.innerHTML = result2;
                result2 = template.content.childNodes;
                break;
              case "text/html":
              case "html":
                result2 = yield response2.text();
                result2 = new DOMParser().parseFromString(result2, "text/html");
                break;
              case "application/json":
              case "text/json":
              case "json":
                result2 = yield response2.json();
                break;
              case "image/svg+xml":
              case "svg":
                result2 = yield response2.text();
                result2 = new DOMParser().parseFromString(result2, "image/svg+xml");
                break;
              case "application/xml":
              case "text/xml":
              case "xml":
                result2 = yield response2.text();
                result2 = new DOMParser().parseFromString(result2, "application/xml");
                break;
            }
          }
          return [null, response2, result2];
        } catch (error2) {
          return [error2 || new Error("Thrown parsing error is falsy"), response2, null];
        }
      });
      const retryRequest = () => __async(void 0, null, function* () {
        var _a;
        let attempt = 0;
        const retryAttempts = options2.retryAttempts || 0;
        const retryDelay = options2.retryDelay || 0;
        while (attempt < retryAttempts) {
          const [error2, response2, result2] = yield executeFetch();
          if (!error2) {
            return [error2, response2, result2];
          }
          if (!((_a = options2.retryCodes) == null ? void 0 : _a.includes(response2.status || 200))) {
            return [new Error("Invalid status code"), response2, result2];
          }
          attempt++;
          if (attempt >= retryAttempts) {
            return [new Error("Too many retry attempts"), response2, result2];
          }
          let delayTime = retryDelay * Math.pow(2, attempt - 1);
          const retryAfter = response2.headers.get("Retry-After");
          if (retryAfter) {
            const retryAfterSeconds = parseInt(retryAfter, 10);
            if (!isNaN(retryAfterSeconds)) {
              delayTime = Math.max(delayTime, retryAfterSeconds * 1e3);
            } else {
              const retryAfterDate = new Date(retryAfter).getTime();
              if (!isNaN(retryAfterDate)) {
                const currentTime = Date.now();
                delayTime = Math.max(delayTime, retryAfterDate - currentTime);
              }
            }
          }
          yield delay(delayTime);
        }
        return executeFetch();
      });
      const [error, response, result] = yield retryRequest();
      if (!response.ok) {
        return [new Error(response.statusText), response, result];
      }
      return [error, response, result];
    });
    return (sendOptions) => __async(void 0, null, function* () {
      const options2 = __spreadValues(__spreadValues({}, initialOptions), cloneRecursive2(sendOptions));
      if (initialOptions.headers) {
        options2.headers = __spreadValues(__spreadValues({}, initialOptions.headers), options2.headers);
      }
      if (options2.debounce) {
        yield debounce(options2.debounce);
      }
      if (options2.delay) {
        yield delay(options2.delay);
      }
      if (options2.throttle) {
        yield throttle(options2.throttle);
      }
      if (options2.maxConcurrency && activeRequests >= options2.maxConcurrency) {
        yield new Promise((resolve) => {
          let interval = null;
          const wait = () => {
            if (activeRequests >= options2.maxConcurrency) {
              interval = requestAnimationFrame(wait);
            } else {
              if (interval) {
                clearInterval(interval);
              }
              resolve(null);
            }
          };
          interval = requestAnimationFrame(wait);
        });
      }
      activeRequests++;
      const results = yield sendRequest(
        options2
      );
      activeRequests--;
      return results;
    });
  };

  // src/utilities/clone.js
  var cloneRecursive3 = (value) => {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        const clone = [];
        for (let i = 0; i < value.length; i++) {
          clone.push(cloneRecursive3(value[i]));
        }
        value = clone;
      } else {
        const clone = {};
        for (const key in value) {
          clone[key] = cloneRecursive3(value[key]);
        }
        value = clone;
      }
    }
    return value;
  };

  // src/utilities/singleton.js
  var createSingleton = (createMethod) => {
    let instance = null;
    return () => {
      if (!instance) {
        instance = createMethod();
      }
      return instance;
    };
  };

  // src/apis/anthropic.js
  var apiSettings = Object.freeze({
    code: "anthropic",
    name: "Anthropic",
    preferredModel: "claude-3-5-haiku-20241022",
    preferredModelName: "Claude 3.5 Haiku",
    requireCredentials: true,
    modelOptionsFilter: (model) => ![
      "(old)"
    ].some((keyword) => model.name.toLowerCase().includes(keyword))
  });
  var _createMessage = createSingleton(
    () => create({
      credentials: "same-origin",
      domain: "https://api.anthropic.com",
      method: "post",
      mode: "cors",
      path: "/v1/messages",
      headers: {
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "anthropic-dangerous-direct-browser-access": "true",
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json"
      }
    })
  );
  var createMessage = (state, messages, context = null, instructions = null) => {
    messages = cloneRecursive3(messages);
    if (instructions) {
      messages.unshift({
        role: "user",
        content: instructions
      });
    }
    return _createMessage()({
      headers: {
        "x-api-key": state.apiCredentials
      },
      body: {
        model: state.apiModel ?? apiSettings.preferredModel,
        messages,
        system: context
      }
    }).then(([error, response, result]) => {
      if (!error) {
        result = {
          role: "assistant",
          content: result?.content?.[0].text
        };
      }
      return [error, response, result];
    });
  };
  var _getModels = createSingleton(
    () => create({
      credentials: "same-origin",
      domain: "https://api.anthropic.com",
      mode: "cors",
      path: "/v1/models",
      headers: {
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "*",
        "anthropic-dangerous-direct-browser-access": "true",
        "anthropic-version": "2023-06-01"
      }
    })
  );
  var getModels = (state) => {
    return _getModels()({
      headers: {
        "x-api-key": state.apiCredentials
      }
    }).then(([error, response, result]) => {
      if (!error) {
        result.data = result.data.map((item) => {
          return {
            ...item,
            name: item.display_name
          };
        });
      }
      return [error, response, result];
    });
  };

  // src/apis/deepseek.js
  var apiSettings2 = Object.freeze({
    code: "deepseek",
    name: "DeepSeek",
    preferredModel: "deepseek-chat",
    // preferredModelName: 'GPT 4o-mini',
    requireCredentials: true
    // modelOptionsFilter: model =>
    //   ![
    //   ].some(keyword => model.id.toLowerCase().includes(keyword))
    //   && !model.id.match(/-(?:\d){4}$/)
    //   && !model.id.match(/-(?:\d){4}-(?:\d){2}-(?:\d){2}$/)
  });
  var _createMessage2 = createSingleton(
    () => create({
      method: "post",
      domain: "https://api.deepseek.com",
      path: "/v1/chat/completions",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
  );
  var createMessage2 = (state, messages, context = null, instructions = null) => {
    messages = cloneRecursive3(messages);
    const prependAppRole = (message) => {
      if (message) {
        if (messages.length > 0 && messages[0].role === "system") {
          messages[0].content = message + " " + messages[0].content;
        } else {
          messages.unshift({
            role: "system",
            content: message
          });
        }
      }
    };
    prependAppRole(instructions);
    prependAppRole(context);
    return _createMessage2()({
      headers: {
        Authorization: "Bearer " + state.apiCredentials
      },
      body: {
        model: state.apiModel ?? apiSettings2.preferredModel,
        messages,
        user: state.userIdentifier
      }
    }).then(([error, response, result]) => {
      if (!error) {
        result = result?.choices?.[0]?.message;
      }
      return [error, response, result];
    });
  };
  var _getModels2 = createSingleton(
    () => create({
      domain: "https://api.deepseek.com",
      path: "/v1/models",
      headers: {
        "Accept": "application/json"
      }
    })
  );
  var getModels2 = (state) => _getModels2()({
    headers: {
      Authorization: "Bearer " + state.apiCredentials
    }
  });

  // src/apis/google.js
  var apiSettings3 = Object.freeze({
    code: "google",
    name: "Google AI",
    preferredModel: "gemini-2.0-flash",
    preferredModelName: "Gemini 2.0 Flash",
    requireCredentials: true,
    modelOptionsFilter: (model) => ![
      "aqa",
      "bison",
      "embedding",
      "imagen",
      "learnlm",
      "vision",
      "1.0",
      "1.5"
    ].some((keyword) => model.id.toLowerCase().includes(keyword)) && !model.id.match(/-(?:\d){3,4}$/) && !model.id.match(/-(?:\d){2}-(?:\d){2}$/)
  });
  var _createMessage3 = createSingleton(
    () => create({
      domain: "https://generativelanguage.googleapis.com",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "post"
    })
  );
  var createMessage3 = (state, messages, context = null, instructions = null) => {
    messages = cloneRecursive3(messages);
    return _createMessage3()({
      path: "/v1beta/models/" + (state.apiModel ?? apiSettings3.preferredModel) + ":generateContent?key=" + state.apiCredentials,
      body: {
        system_instruction: context || instructions ? {
          parts: [context, instructions].filter((text) => text).map((text) => ({
            text
          }))
        } : void 0,
        contents: messages.length > 0 ? messages.map((message) => ({
          parts: [{
            text: message.content
          }],
          role: message.role === "assistant" ? "model" : "user"
        })) : { parts: { text: "" } }
      }
    }).then(([error, response, result]) => {
      console.log("createMessage", error, response, result);
      if (!error) {
        result = {
          content: result?.candidates?.[0]?.content?.parts?.map((part) => part.text).join(" "),
          role: "assistant"
        };
      }
      return [error, response, result];
    });
  };
  var _getModels3 = createSingleton(
    () => create({
      domain: "https://generativelanguage.googleapis.com",
      headers: {
        "Accept": "application/json"
      }
    })
  );
  var getModels3 = (state) => _getModels3()({
    path: "/v1beta/models?pageSize=1000&key=" + state.apiCredentials
  }).then(([error, response, result]) => {
    if (!error) {
      result = {
        data: result.models.map((model) => ({
          ...model,
          id: model.name.split("/").pop(),
          name: model.displayName
        }))
      };
    }
    return [error, response, result];
  });

  // src/apis/open-ai.js
  var apiSettings4 = Object.freeze({
    code: "open_ai",
    name: "OpenAI",
    preferredModel: "gpt-4o-mini",
    // preferredModelName: 'GPT 4o-mini',
    requireCredentials: true,
    modelOptionsFilter: (model) => ![
      "babbage-",
      "dall-e-",
      "davinci-",
      "embedding-",
      "moderation-",
      "tts-",
      "whisper-"
    ].some((keyword) => model.id.toLowerCase().includes(keyword)) && !model.id.match(/-(?:\d){4}$/) && !model.id.match(/-(?:\d){4}-(?:\d){2}-(?:\d){2}$/)
  });
  var _createMessage4 = createSingleton(
    () => create({
      method: "post",
      domain: "https://api.openai.com",
      path: "/v1/chat/completions",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
  );
  var createMessage4 = (state, messages, context = null, instructions = null) => {
    const appRole = (state.apiModel ?? apiSettings4.preferredModel).toLowerCase().match(/4o|3\.5/) ? "system" : "developer";
    messages = cloneRecursive3(messages);
    const prependAppRole = (message) => {
      if (message) {
        if (messages.length > 0 && messages[0].role === appRole) {
          messages[0].content = message + " " + messages[0].content;
        } else {
          messages.unshift({
            role: appRole,
            content: message
          });
        }
      }
    };
    prependAppRole(instructions);
    prependAppRole(context);
    return _createMessage4()({
      headers: {
        Authorization: "Bearer " + state.apiCredentials
      },
      body: {
        model: state.apiModel ?? apiSettings4.preferredModel,
        messages,
        user: state.userIdentifier
      }
    }).then(([error, response, result]) => {
      if (!error) {
        result = result?.choices?.[0]?.message;
      }
      return [error, response, result];
    });
  };
  var _getModels4 = createSingleton(
    () => create({
      domain: "https://api.openai.com",
      path: "/v1/models",
      headers: {
        "Accept": "application/json"
      }
    })
  );
  var getModels4 = (state) => _getModels4()({
    headers: {
      Authorization: "Bearer " + state.apiCredentials
    }
  });

  // src/apis/apis.js
  var APIS = Object.freeze({
    anthropic: apiSettings,
    deepseek: apiSettings2,
    google: apiSettings3,
    open_ai: apiSettings4
  });
  var callApi = (lookupTable, state, ...parameters) => {
    let method = null;
    if (state.apiCode) {
      method = lookupTable[state.apiCode];
    }
    if (method) {
      return method(state, ...parameters);
    }
    return Promise.resolve(
      [new Error("No api selected."), null, null]
    );
  };
  var createMessage5 = (state, messages, context = null, instructions = null) => callApi({
    [APIS.anthropic.code]: createMessage,
    [APIS.deepseek.code]: createMessage2,
    [APIS.google.code]: createMessage3,
    [APIS.open_ai.code]: createMessage4
  }, state, messages, context, instructions);
  var getModels5 = (state) => callApi({
    [APIS.anthropic.code]: getModels,
    [APIS.deepseek.code]: getModels2,
    [APIS.google.code]: getModels3,
    [APIS.open_ai.code]: getModels4
  }, state);
  var isReady = (state) => {
    return state.apiCode && APIS[state.apiCode] && (!APIS[state.apiCode]?.requireCredentials || state.apiCredentialsTested) && (state.apiModel ?? APIS[state.apiCode].preferredModel) && state.apiModels?.data?.some(
      (model) => model.id === (state.apiModel ?? APIS[state.apiCode].preferredModel)
    );
  };

  // src/data/locales.js
  var PROFICIENCY_LEVELS = Object.freeze({
    a1: "a1",
    a2: "a2",
    b1: "b1",
    b2: "b2",
    c1: "c1",
    c2: "c2"
  });
  var PROFICIENCY_LEVEL_CODES = Object.keys(PROFICIENCY_LEVELS);
  var LOCALES = Object.freeze({
    dan: "dan",
    // Danish
    deu: "deu",
    // German
    eng: "eng",
    // English
    epo: "epo",
    // Esperanto
    fry: "fry",
    // Frisian (West)
    isl: "isl",
    // Icelandic
    nld: "nld",
    // Dutch
    nno: "nno",
    // Norwegian (Nynorsk)
    nob: "nob",
    // Norwegian (Bokmål)
    swe: "swe",
    // Swedish
    vls: "vls"
    // Flemish
  });
  var LOCALE_CODES = Object.keys(LOCALES);
  var getLanguageFromLocale = (localeCode) => (localeCode ?? "").split("_")[0].split("-")[0];
  var getPreferredLocale = () => window.navigator.languages.map(
    (languageCode) => languageCode.split("-").filter(
      (_, index) => index < 2
    ).join("-").replace("-", "_").toLowerCase()
  ).reduce((preferredLanguage, languageCode) => {
    if (preferredLanguage) {
      return preferredLanguage;
    }
    for (let i = 0; i < LOCALE_CODES.length; i++) {
      const possibleLanguage = LOCALE_CODES[i];
      if (languageCode === possibleLanguage) {
        return possibleLanguage;
      }
      if (possibleLanguage.startsWith(languageCode + "_")) {
        return possibleLanguage;
      }
    }
    return preferredLanguage;
  }, null) ?? LOCALES.eng;

  // src/data/screens.js
  var SCREENS = Object.freeze({
    setup: "setup",
    overview: "overview",
    options: "options",
    clarification: "clarification",
    comprehension: "comprehension",
    conversation: "conversation",
    story: "story",
    vocabulary: "vocabulary"
  });

  // src/data/translations.js
  var translate = (state, key, locale = null) => {
    locale ??= state.sourceLocale;
    if (!(locale in TRANSLATIONS)) {
      console.warn('There are no translations available for the language "' + locale + '".');
      return key;
    }
    if (!(key in TRANSLATIONS[locale])) {
      console.warn('There are no translations available for the language "' + locale + '" with the key "' + key + '".');
      return key;
    }
    const replace = (text) => {
      if (!text) {
        return text;
      }
      if (Array.isArray(text)) {
        return text.map((item) => replace(item));
      }
      return text.replace(
        /{%s:([^%]+)%}/g,
        (match2, key2) => {
          let value = key2.split(".").reduce(
            (innerState, keySegment) => innerState?.[keySegment],
            state
          );
          if (value !== void 0 && value !== null) {
            if (Array.isArray(value)) {
              return value.join(" ");
            }
            return value.toString();
          }
          return match2;
        }
      ).replace(
        /{%t:([^%]+)%}/g,
        (match2, key2) => {
          if (key2 in TRANSLATIONS[locale]) {
            let value = TRANSLATIONS[locale][key2];
            if (value !== void 0 && value !== null) {
              if (Array.isArray(value)) {
                return value.join(" ");
              }
              return value.toString();
            }
          }
          return match2;
        }
      );
    };
    return replace(TRANSLATIONS[locale][key]);
  };
  var TRANSLATIONS = Object.freeze({
    [LOCALES.eng]: {
      [LOCALES.dan]: "Danish",
      [LOCALES.deu]: "German",
      [LOCALES.eng]: "English (United Kingdom)",
      [LOCALES.epo]: "Esperanto",
      [LOCALES.fry]: "Frisian (West)",
      [LOCALES.isl]: "Icelandic",
      [LOCALES.nld]: "Dutch",
      [LOCALES.nno]: "Norwegian (Nynorsk)",
      [LOCALES.nob]: "Norwegian (Bokm\xE5l)",
      [LOCALES.swe]: "Swedish",
      [LOCALES.vls]: "Flamish",
      "proficiency_name-a1": "A1: Beginner",
      "proficiency_description-a1": [
        // 'Spoken interaction: You can interact in a simple way provided the other person is prepared to repeat or rephrase things at a slower rate of speech and help me formulate what you are trying to say. You can ask and answer simple questions in areas of immediate need or on very familiar topics.',
        // 'Spoken production: You can use simple phrases and sentences to describe where you live and people you know.',
        // 'Listening: You can recognise familiar words and very basic phrases concerning yourself, your family and immediate concrete surroundings when people speak slowly and clearly.',
        "Reading: You can understand familiar names, words and very simple sentences, for example on notices and posters or in catalogues.",
        "Writing: You can write a short, simple postcard, for example sending holiday greetings. You can fill in forms with personal details, for example entering my name, nationality and address on a hotel registration form."
      ],
      "proficiency_example-a1": '"Hello! My name is Maria. I live in a small house in London with my family. I have one brother and one sister. I like to eat apples and pears. What is your favourite fruit?"',
      "proficiency_name-a2": "A2: Pre-intermediate",
      "proficiency_description-a2": [
        // 'Spoken interaction: You can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar topics and activities. You can handle very short social exchanges, even though I can\'t usually understand enough to keep the conversation going yourself.',
        // 'Spoken production: You can use a series of phrases and sentences to describe in simple terms your family and other people, living conditions, your educational background and your present or most recent job.',
        // 'Listening: You can understand phrases and the highest frequency vocabulary related to areas of most immediate personal relevance (e.g. very basic personal and family information, shopping, local area, employment). You can catch the main point in short, clear, simple messages and announcements.',
        "Reading: You can read very short, simple texts. You can find specific, predictable information in simple everyday material such as advertisements, prospectuses, menus and timetables and you can understand short simple personal letters.",
        "Writing: You can write short, simple notes and messages relating to matters in areas of immediate needs. You can write a very simple personal letter, for example thanking someone for something."
      ],
      "proficiency_example-a2": '"Last weekend, I went to the park with my friends. We had a picnic with sandwiches and juice. The weather was sunny, and we played football. After that, we went to a caf\xE9 and had some ice cream. It was a fun day!"',
      "proficiency_name-b1": "B1: Intermediate",
      "proficiency_description-b1": [
        // 'Spoken interaction: You can deal with most situations likely to arise whilst travelling in an area where the language is spoken. You can enter unprepared into conversation on topics that are familiar, of personal interest or pertinent to everyday life (e.g. family, hobbies, work, travel and current events).',
        // 'Spoken production: You can connect phrases in a simple way in order to describe experiences and events, your dreams, hopes and ambitions. You can briefly give reasons and explanations for opinions and plans. You can narrate a story or relate the plot of a book or film and describe your reactions.',
        // 'Listening: You can understand the main points of clear standard speech on familiar matters regularly encountered in work, school, leisure, etc. You can understand the main point of many radio or TV programmes on current affairs or topics of personal or professional interest when the delivery is relatively slow and clear.',
        "Reading: You can understand texts that consist mainly of high frequency every day or job-related language. You can understand the description of events, feelings and wishes in personal letters.",
        "Writing: You can write simple connected text on topics which are familiar or of personal interest. You can write personal letters describing experiences and impressions."
      ],
      "proficiency_example-b1": `"I enjoy reading books, especially mystery novels. Recently, I finished a story about a detective who solved a difficult case. It was very interesting, and I couldn't stop reading. I like mysteries because they make me think and try to guess the ending."`,
      "proficiency_name-b2": "B2: Upper-intermediate",
      "proficiency_description-b2": [
        // 'Spoken interaction: You can interact with a degree of fluency and spontaneity that makes regular interaction with native speakers quite possible. You can take an active part in discussion in familiar contexts, accounting for and sustaining your views.',
        // 'Spoken production: You can present clear, detailed descriptions on a wide range of subjects related to your field of interest. You can explain a viewpoint on a topical issue giving the advantages and disadvantages of various options.',
        // 'Listening: You can understand extended speech and lectures and follow even complex lines of argument provided the topic is reasonably familiar. You can understand most TV news and current affairs programmes. You can understand the majority of films in standard dialect.',
        "Reading: You can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints. You can understand contemporary literary prose.",
        "Writing: You can write clear, detailed text on a wide range of subjects related to my interests. You can write an essay or report, passing on information or giving reasons in support of or against a particular point of view. You can write letters highlighting the personal significance of events and experiences."
      ],
      "proficiency_example-b2": '"The concept of remote work has become increasingly popular in recent years. It offers flexibility and convenience for employees, allowing them to work from anywhere. However, it also presents challenges, such as maintaining productivity and communication with colleagues. Overall, I think the benefits outweigh the drawbacks."',
      "proficiency_name-c1": "C1: Advanced",
      "proficiency_description-c1": [
        // 'Spoken interaction: You can express yourself fluently and spontaneously without much obvious searching for expressions. You can use language flexibly and effectively for social and professional purposes. You can formulate ideas and opinions with precision and relate your contribution skilfully to those of other speakers.',
        // 'Spoken production: You can present clear, detailed descriptions of complex subjects integrating sub-themes, developing particular points and rounding off with an appropriate conclusion.',
        // 'Listening: You can understand extended speech even when it is not clearly structured and when relationships are only implied and not signalled explicitly. You can understand television programmes and films without too much effort.',
        "Reading: You can understand long and complex factual and literary texts, appreciating distinctions of style. You can understand specialised articles and longer technical instructions, even when they do not relate to your field.",
        "Writing: You can express yourself in clear, well-structured text, expressing points of view at some length. You can write about complex subjects in a letter, an essay or a report, underlining what you consider to be the salient issues. You can select style appropriate to the reader in mind."
      ],
      "proficiency_example-c1": '"Climate change is one of the most pressing issues of our time. While renewable energy sources such as wind and solar power are growing in importance, transitioning away from fossil fuels remains a significant challenge. Governments must collaborate with industries and communities to create sustainable policies that balance economic growth with environmental conservation."',
      "proficiency_name-c2": "C2: Proficient",
      "proficiency_description-c2": [
        // 'Spoken interaction: You can take part effortlessly in any conversation or discussion and have a good familiarity with idiomatic expressions and colloquialisms. You can express yourself fluently and convey finer shades of meaning precisely. If you do have a problem you can backtrack and restructure around the difficulty so smoothly that other people are hardly aware of it.',
        // 'Spoken production: You can present a clear, smoothly-flowing description or argument in a style appropriate to the context and with an effective logical structure which helps the recipient to notice and remember significant points.',
        // 'Listening: You have no difficulty in understanding any kind of spoken language, whether live or broadcast, even when delivered at fast native speed, provided. You have some time to get familiar with the accent.',
        "Reading: You can read with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts such as manuals, specialised articles and literary works.",
        "Writing: You can write clear, smoothly-flowing text in an appropriate style. You can write complex letters, reports or articles which present a case with an effective logical structure which helps the recipient to notice and remember significant points. You can write summaries and reviews of professional or literary works."
      ],
      "proficiency_example-c2": '"The nuances of linguistic evolution reveal much about cultural and societal shifts over time. For instance, the adoption of loanwords often signals a period of cultural exchange or influence. Analysing such patterns not only enhances our understanding of language development but also offers profound insights into historical relationships between civilizations. This dynamic interplay underscores the complexity and interconnectedness of human communication."',
      "prompt-context": 'You are an expert in and teacher of {%t:{%s:targetLocale%}%}. The user is studying {%t:{%s:targetLocale%}%}. The user already masters the language at CEFR level {%s:proficiencyLevel%}. This means that the user already has the following skills: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". However, the user wants to improve their proficiency further.',
      "prompt-comprehension": "Write a reading and writing exercise where the user receives a text in {%t:{%s:targetLocale%}%} along with a question in {%t:{%s:sourceLocale%}%} about the text, to which the user must respond in {%t:{%s:targetLocale%}%}. Do not provide any further instructions, explanations, or answers to the user. Always write in plain text without any formatting, labels, or headings.",
      "prompt-comprehension-follow_up": "Provide feedback on the reading and writing exercise given. Offer concise feedback on the {%t:{%s:targetLocale%}%} with in-depth analysis that is clear enough for the user's level of knowledge. Write the feedback in {%t:{%s:sourceLocale%}%}. Focus exclusively on linguistic aspects and ignore content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.",
      "prompt-conversation": "You will simulate a conversation with the user in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings. Write the first message in the conversation, immediately introducing a topic to discuss.",
      "prompt-conversation-follow_up": "You are simulating a conversation with the user in {%t:{%s:targetLocale%}%}. First, provide brief, in-depth feedback on the message in {%t:{%s:sourceLocale%}%}, focusing solely on linguistic aspects and ignoring any content-related evaluations or interpretations. Then, respond to the message in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings.",
      "prompt-clarification": "The user has a question below, answer it concisely with in-depth feedback, appropriate to the user's proficiency level. Answer the question {%t:{%s:sourceLocale%}%} and provide examples in {%t:{%s:targetLocale%}%} where appropriate. Always write in plain text without any formatting, labels, or headings. Do not answer the question if it is not language-related.",
      "prompt-story": "You and the user will collaboratively write a story by taking turns adding sections. Begin by writing the first section of the story in {%t:{%s:targetLocale%}%}, introducing an engaging theme or setting. Focus on having fun and practising the language. Do not include any additional instructions, explanations, formatting, labels, or headings.",
      "prompt-story-follow_up": "You are continuing the collaborative story-writing session with the user. First, provide concise, in-depth feedback in {%t:{%s:sourceLocale%}%} on the user's latest section, focusing solely on linguistic aspects and suggesting improvements. Avoid any comments about the story's plot, logic, or content. Then, add your next section of the story in {%t:{%s:targetLocale%}%}. Write your response in plain text without any formatting, labels, or headings.",
      "prompt-topic": ' Incorporate the following topic into your message "{%topic%}".',
      "prompt-vocabulary": "Write a word in {%t:{%s:targetLocale%}%} along with its definition in {%t:{%s:sourceLocale%}%}. The user will then write a sentence in {%t:{%s:targetLocale%}%} in which this word must be used. Take into account the user's skill and language level. Do not provide any additional instructions, explanations, or the answer to the user. Always write in plain text without any formatting, labels, or headings.",
      "prompt-vocabulary-follow_up": "Provide feedback on the sentence in which the user has answered. Check whether the word has been used correctly in the sentence. Provide concise feedback on the {%t:{%s:targetLocale%}%} with considerable depth that is clear enough for the user's level of knowledge. Write the feedback in {%t:{%s:sourceLocale%}%}. Focus exclusively on linguistic aspects and ignore content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.",
      "greeting": "Hi!",
      "button-go_back": "Go back",
      "button-reset": "Reset",
      "button-generate": "Generate",
      "button-answer": "Answer",
      "button-reply": "Reply",
      "button-ask": "Ask",
      "credits-link": "Made by {%name%}",
      "select_an_option": "Select an option",
      "setup-source_language": "So, you want to improve your proficiency in a language? Let this app help you practise. We need to start by choosing a language you already know.",
      "setup-target_language": "Now the next step, which language would you like to learn?",
      "setup-proficiency_level": "How proficient would you say you already are in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.",
      "setup-topics_of_interest": "It's much more enjoyable if the exercises sometimes feature a topic you find interesting. Therefore, fill in a few topics below that can regularly appear. Think mainly of any hobbies or other interests. The more, the better!",
      "setup-api_code": `This app uses a "Large Language Model" to generate and assess exercises. You may have heard about it, everyone in the tech sector keeps talking about developments in artificial intelligence. The app uses an LLM, but doesn't come with one, so we need to link it to an LLM provider. Which provider would you like to use?`,
      "setup-api_credentials": "Now, the important question is the key. You can get it from the developer's dashboard. It probably states that you shouldn't share it with third parties. Fortunately, this app never sends the key elsewhere. Still not convinced? Check out the app's source code or wait for a version that no longer requires this.",
      "setup-test_api_credentials": "Test key",
      "setup-api_credentials_untested": "Test the credentials before proceeding.",
      "setup-api_credentials_tested": 'The provided key works. Now you can choose which "Large Language Model" to use. Not sure what the differences are? No problem, we recommend selecting "{%preferredModel%}". That should be fine.',
      "setup-outro": "Good luck and have fun!",
      "setup-next": "Start practising",
      "overview-intro": "What would you like to do?",
      "overview-comprehension-title": "Answer questions",
      "overview-comprehension-description": "You'll receive a short text along with a question to answer.",
      "overview-conversation-title": "Practise conversations",
      "overview-conversation-description": "A short conversation will be simulated, for example about ordering food or discussing a hobby.",
      "overview-clarification-title": "Ask for clarification",
      "overview-clarification-description": "Get explanations about {%t:{%s:targetLanguage%}%}, such as a grammar rule like conjugations or cases.",
      "overview-story-title": "Write a story",
      "overview-story-description": "You'll take turns writing a story piece by piece.",
      "overview-options-title": "Change settings",
      "overview-options-description": "Change the language you want to learn, the topics you find interesting, or the LLM used.",
      "overview-vocabulary-title": "Learn words",
      "overview-vocabulary-description": "You'll receive a word together with its definition, you then respond with a with a sentence using that word.",
      "options-source_language": "Which language do you already know?",
      "options-target_language": "Which language would you like to learn?",
      "options-proficiency_level": "How proficient are you in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.",
      "options-topics_of_interest": "Fill in a few topics below that can regularly appear in the exercises.",
      "options-api_code": 'This app uses a "Large Language Model" to generate and assess exercises. Which provider would you like to link?',
      "options-api_credentials": "Enter the key from the developer's dashboard.",
      "options-test_api_credentials": "Test key",
      "options-api_credentials_untested": "Test the credentials before proceeding.",
      "options-api_credentials_tested": 'The provided key works. Choose a "Large Language Model" to use, we recommend "{%preferredModel%}".',
      "statistics-activity_per_category": "You have already answered {%s:statisticComprehensionActivity%} questions,  {%s:statisticVocabularyActivity%} words practised, sent {%s:statisticConversationActivity%} messages, told {%s:statisticStoryActivity%} stories, and asked {%s:statisticClarificationActivity%} questions.",
      "statistics-no_activity": "Unfortunately, you haven't completed enough activities yet to display here. Go to the overview and choose an exercise to start. Your progress will be tracked in the background.",
      "statistics-no_activity_streak": "You currently have no ongoing activity streak. You can build one by completing at least one exercise on multiple consecutive days.",
      "statistics-current_activity_streak": "Your current activity streak is {%s:statisticCurrentActivityStreak%} days long. Don't loose it and practise before midnight to extend it!",
      "statistics-extended_activity_streak": "Good job, you extended your streak for today! Your current activity streak is {%s:statisticCurrentActivityStreak%} days long.",
      "statistics-longest_activity_streak": "Your longest activity streak ever was {%s:statisticLongestActivityStreak%} days long.",
      "clarification-intro": "What would you like more information about?",
      "clarification-placeholder": "I'm wondering about...",
      "comprehension-intro": "In a moment you'll read a text in {%t:{%s:targetLanguage%}%} along with a question about it. Answer the question in {%t:{%s:targetLanguage%}%}. You'll then receive some feedback regarding your answer.",
      "conversation-intro": "In a moment you'll simulate a conversation in {%t:{%s:targetLanguage%}%}, so always respond in {%t:{%s:targetLanguage%}%}. You may receive feedback along the way.",
      "story-intro": "You're about to write a story in {%t:{%s:targetLanguage%}%} where, in turns, you add a piece. Don't worry about whether the story is good, logical, or well-founded; just make sure you practice the language. Therefore, always respond in {%t:{%s:targetLanguage%}%}. In between, you might receive some feedback on your writing.",
      "vocabulary-intro": "In a moment you'll read a word together with its definition in {%t:{%s:targetLanguage%}%}. Answer with a scentence that uses the word in {%t:{%s:targetLanguage%}%}. You'll then receive some feedback regarding your answer."
    },
    [LOCALES.nld]: {
      [LOCALES.dan]: "Deens",
      [LOCALES.deu]: "Duits",
      [LOCALES.eng]: "Engels (Verenigd Koninkrijk)",
      [LOCALES.epo]: "Esperanto",
      [LOCALES.fry]: "Fries (West)",
      [LOCALES.isl]: "IJslands",
      [LOCALES.nld]: "Nederlands",
      [LOCALES.nno]: "Noors (Nynorsk)",
      [LOCALES.nob]: "Noors (Bokm\xE5l)",
      [LOCALES.swe]: "Zweeds",
      [LOCALES.vls]: "Vlaams",
      "proficiency_name-a1": "A1: Beginner",
      "proficiency_description-a1": [
        "Lezen: Je kunt vertrouwde namen, woorden en zeer eenvoudige zinnen begrijpen, bijvoorbeeld op aankondigingen en posters of in catalogi.",
        "Schrijven: Je kunt een korte, eenvoudige ansichtkaart schrijven, bijvoorbeeld om vakantiegroeten te sturen. Je kunt formulieren invullen met persoonlijke gegevens, zoals je naam, nationaliteit en adres op een hotelregistratieformulier."
      ],
      "proficiency_example-a1": '"Hallo! Ik heet Maria. Ik woon in een klein huis in Amsterdam met mijn familie. Ik heb een broer en een zus. Ik hou van appels en peren. Wat is jouw favoriete fruit?"',
      "proficiency_name-a2": "A2: Pre-intermediair",
      "proficiency_description-a2": [
        "Lezen: Je kunt zeer korte, eenvoudige teksten lezen. Je kunt specifieke, voorspelbare informatie vinden in eenvoudig alledaags materiaal zoals advertenties, folders, menu's en dienstregelingen, en je kunt korte eenvoudige persoonlijke brieven begrijpen.",
        "Schrijven: Je kunt korte, eenvoudige notities en berichten schrijven die betrekking hebben op zaken van directe noodzaak. Je kunt een heel eenvoudige persoonlijke brief schrijven, bijvoorbeeld om iemand te bedanken."
      ],
      "proficiency_example-a2": '"Afgelopen weekend ging ik met mijn vrienden naar het park. We hadden een picknick met broodjes en sap. Het weer was zonnig, en we speelden voetbal. Daarna gingen we naar een caf\xE9 en aten we ijs. Het was een leuke dag!"',
      "proficiency_name-b1": "B1: Intermediair",
      "proficiency_description-b1": [
        "Lezen: Je kunt teksten begrijpen die voornamelijk bestaan uit alledaagse of werkgerelateerde taal met een hoge frequentie. Je kunt de beschrijving van gebeurtenissen, gevoelens en wensen begrijpen in persoonlijke brieven.",
        "Schrijven: Je kunt eenvoudige, samenhangende teksten schrijven over onderwerpen die vertrouwd of van persoonlijk belang zijn. Je kunt persoonlijke brieven schrijven waarin je ervaringen en indrukken beschrijft."
      ],
      "proficiency_example-b1": '"Ik lees graag boeken, vooral detectiveverhalen. Onlangs heb ik een verhaal gelezen over een rechercheur die een moeilijk mysterie oploste. Het was erg interessant, en ik kon niet stoppen met lezen. Ik hou van dit genre omdat het me aan het denken zet en ik probeer het einde te raden."',
      "proficiency_name-b2": "B2: Upper-intermediair",
      "proficiency_description-b2": [
        "Lezen: Je kunt artikelen en rapporten lezen die gaan over actuele problemen waarin de schrijvers specifieke houdingen of standpunten innemen. Je kunt eigentijdse literaire proza begrijpen.",
        "Schrijven: Je kunt duidelijke, gedetailleerde teksten schrijven over een breed scala aan onderwerpen die verband houden met je interesses. Je kunt een essay of rapport schrijven waarin je informatie doorgeeft of redenen geeft ter ondersteuning of afwijzing van een bepaald standpunt. Je kunt brieven schrijven waarin je de persoonlijke betekenis van gebeurtenissen en ervaringen benadrukt."
      ],
      "proficiency_example-b2": `"Het concept van thuiswerken is de laatste jaren steeds populairder geworden. Het biedt flexibiliteit en gemak voor werknemers, waardoor ze overal kunnen werken. Maar het brengt ook uitdagingen met zich mee, zoals het behouden van productiviteit en communicatie met collega's. Over het algemeen denk ik dat de voordelen groter zijn dan de nadelen."`,
      "proficiency_name-c1": "C1: Gevorderd",
      "proficiency_description-c1": [
        "Lezen: Je kunt lange en complexe feitelijke en literaire teksten begrijpen en waarderen, waarbij je onderscheid maakt in stijl. Je kunt gespecialiseerde artikelen en langere technische instructies begrijpen, zelfs wanneer deze niet in je vakgebied liggen.",
        "Schrijven: Je kunt jezelf duidelijk en goed gestructureerd uitdrukken in tekst, waarbij je standpunten uitvoerig uiteenzet. Je kunt schrijven over complexe onderwerpen in een brief, essay of rapport, en daarbij benadrukken wat je als de belangrijkste kwesties beschouwt. Je kunt een stijl kiezen die geschikt is voor de beoogde lezer."
      ],
      "proficiency_example-c1": '"Klimaatverandering is een van de meest urgente problemen van deze tijd. Hoewel hernieuwbare energiebronnen zoals wind- en zonne-energie steeds belangrijker worden, blijft de overgang van fossiele brandstoffen een grote uitdaging. Overheden moeten samenwerken met industrie\xEBn en gemeenschappen om duurzame beleidsmaatregelen te cre\xEBren die economische groei en milieubescherming in balans brengen."',
      "proficiency_name-c2": "C2: Proficient",
      "proficiency_description-c2": [
        "Lezen: Je kunt vrijwel alle vormen van geschreven taal met gemak lezen, inclusief abstracte, structureel of taalkundig complexe teksten zoals handleidingen, gespecialiseerde artikelen en literaire werken.",
        "Schrijven: Je kunt heldere, vloeiende teksten schrijven in een passende stijl. Je kunt complexe brieven, rapporten of artikelen schrijven die een zaak presenteren met een effectieve logische structuur die de ontvanger helpt belangrijke punten op te merken en te onthouden. Je kunt samenvattingen en recensies schrijven van professionele of literaire werken."
      ],
      "proficiency_example-c2": '"De nuances van taalontwikkeling onthullen veel over culturele en maatschappelijke veranderingen door de tijd heen. Zo duidt de opname van leenwoorden vaak op een periode van culturele uitwisseling of invloed. Het analyseren van dergelijke patronen verrijkt niet alleen ons begrip van taalontwikkeling, maar biedt ook waardevolle inzichten in historische relaties tussen beschavingen. Deze dynamiek benadrukt de complexiteit en verbondenheid van menselijke communicatie."',
      "prompt-context": 'Je bent een expert in en docent van het {%t:{%s:targetLocale%}%}. De gebruiker is {%t:{%s:targetLocale%}%} aan het studeren. De gebruiker beheerst de taal al tot CEFR niveau {%s:proficiencyLevel%}. Dit betekend dat de gebruiker al de volgende vaardigheden beheerst: "{%t:proficiency_description-{%s:proficiencyLevel%}%}" Maar de gebruiker wil de taal nog beter leren beheersen.',
      "prompt-comprehension": "Schrijf een lees en schrijfvaardigheidsoefening waarbij de gebruiker een tekst in het {%t:{%s:targetLocale%}%} krijgt samen met een vraag in het {%t:{%s:sourceLocale%}%} over de tekst waarop de gebruiker moet antwoorden in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies, uitleg of het antwoord aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-comprehension-follow_up": "Geef feedback op de lees en schrijfvaardigheidsoefening die gesteld is. Geef beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf de feedback in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-conversation": "Je gaat met de gebruiker een gesprek simuleren in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Schrijf het eerste bericht in een gesprek dat al gelijk een onderwerp introduceert om het over te hebben.",
      "prompt-conversation-follow_up": "Je bent met de gebruiker een gesprek aan het simuleren in het {%t:{%s:targetLocale%}%}. Geef als antwoord op een bericht eerst beknopt feedback met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Ga daarna verder met het antwoorden op het bericht in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-clarification": "De gebruiker heeft onderstaande vraag, beantwoord de vraag beknopt met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Beantwoord de vraag in het {%t:{%s:sourceLocale%}%} geef voorbeelden in het {%t:{%s:targetLocale%}%} waar nodig. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Beantwoord de vraag niet als het absoluut niet taal gerelateerd is.",
      "prompt-story": "Jij en de gebruiker gaan samen een verhaal schrijven door om de beurt een gedeelte toe te voegen. Begin met het schrijven van de eerste sectie van het verhaal in {%t:{%s:targetLocale%}%}, waarin je een boeiend thema of een interessante setting introduceert. Richt je op plezier hebben en het oefenen van de taal. Voeg geen extra instructies, uitleg, opmaak, labels of koppen toe.",
      "prompt-story-follow_up": "Je zet de gezamenlijke sessie voor het schrijven van een verhaal met de gebruiker voort. Geef eerst korte, diepgaande feedback in {%t:{%s:sourceLocale%}%} op de laatste bijdrage van de gebruiker, waarbij je je uitsluitend richt op taalkundige aspecten en suggesties voor verbetering geeft. Maak geen opmerkingen over de plot, logica of inhoud van het verhaal. Voeg daarna jouw volgende gedeelte van het verhaal toe in {%t:{%s:targetLocale%}%}. Schrijf je antwoord in platte tekst zonder opmaak, labels of koppen.",
      "prompt-topic": ' Verwerk het volgende onderwerp in jouw bericht "{%topic%}".',
      "prompt-vocabulary": "Schrijf een woord in het {%t:{%s:targetLocale%}%} samen met de definitie in het {%t:{%s:sourceLocale%}%}. De gebruiker zal vervolgens een zin in het {%t:{%s:targetLocale%}%} schrijven waarin dit woord verwerkt moeten worden. Hou hierbij rekening met de vaardigheid en taalniveau van de gebruiker. Geef geen verdere instructies, uitleg of het antwoord aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-vocabulary-follow_up": "Geef feedback op de zin waarmee de gebruik antwoord heeft gegeven. Controleer of de woord juist gebruikt is in de zin. Geef beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf de feedback in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "greeting": "Hoi!",
      "button-go_back": "Ga terug",
      "button-reset": "Resetten",
      "button-generate": "Genereren",
      "button-answer": "Antwoorden",
      "button-reply": "Antwoorden",
      "button-ask": "Vragen",
      "credits-link": "Gemaakt door {%name%}",
      "select_an_option": "Selecteer een optie",
      "setup-source_language": "Dus jij wilt een taal beter beheersen? Laat deze app je helpen met oefenen. We moeten beginnen met een taal te kiezen die je al kent.",
      "setup-target_language": "Nu het volgende probleem, welke taal wil je leren?",
      "setup-proficiency_level": "Hoe goed zou jij zeggen dat je al in de taal bent? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.",
      "setup-topics_of_interest": "Het is natuurlijk veel leuker als er af en toe een onderwerp voorbij komt wat je interessant vind. Vul daarom hieronder een aantal onderwerpen in die regelmatig terug kunnen komen. Denk hierbij vooral aan enige hobbies of andere interesses. Des te meer des te beter!",
      "setup-api_code": 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model". Je hebt er vast wel van gehoord, iedereen in de technologie sector houdt maar niet op over de ontwikkelingen in kunstmatige intelligentie. De app maakt dus gebruik van een LLM om de oefening te maken en te beoordelen. Helaas komt de app niet zelf met een eentje, dus moeten we een koppeling maken met een LLM. Met welke aanbieder wil je een koppeling maken?',
      "setup-api_credentials": "Nu is de grote vraag nog de sleutel. Deze kun je bij het ontwikkelaars paneel. Er staat waarschijnlijk al bij vermeld dat je deze niet met derden moet delen. Gelukkig stuurt deze app nooit de sleutel door. Vertrouw je het toch niet? Bekijk dan de brondcode van deze app, of wacht wellicht tot er een variant gemaakt is waarbij dat niet meer nodig is.",
      "setup-test_api_credentials": "Sleutel testen",
      "setup-api_credentials_untested": "Test de gegevens eerst voordat je verder gaat.",
      "setup-api_credentials_tested": 'De opgegeven sleutel werkt, nu kan je nog kiezen uit welke "Large Language Model" je wilt gebruiken. Heb je geen idee wat de verschillen zijn? Geen probleem, we raden aan dat je "{%preferredModel%}" selecteert, daarmee komt het vast wel goed.',
      "setup-outro": "Heel veel succes en plezier!",
      "setup-next": "Begin met oefenen",
      "overview-intro": "Wat wil je gaan doen?",
      "overview-comprehension-title": "Beantwoord vragen",
      "overview-comprehension-description": "Je krijgt een korte tekst samen met een vraag die je kan beantwoorden.",
      "overview-conversation-title": "Oefen gesprekken",
      "overview-conversation-description": "Er zal een kort gesprekje gespeeld worden over bijvoorbeeld het bestellen van eten of over een hobby.",
      "overview-clarification-title": "Vraag om uitleg",
      "overview-clarification-description": "Krijg verduidelijk over het {%t:{%s:targetLanguage%}%}, bijvoorbeeld een grammatica regel zoals vervoegingen en naamvallen.",
      "overview-options-title": "Pas instellingen aan",
      "overview-options-description": "Pas aan welke taal je wilt leren, welke onderwerpen je interessant vind of welke LLM gebruikt wordt.",
      "overview-story-title": "Schrijf een verhaal",
      "overview-story-description": "Je gaat omste beurten stukje voor stukje een verhaal schrijven.",
      "overview-vocabulary-title": "Leer woorden",
      "overview-vocabulary-description": "Je krijgt een woord samen met de definitie ervan vervolgens schrijf je een zin dat dit woord gebruikt.",
      "options-source_language": "Welke taal ken je al?",
      "options-target_language": "Welke taal wil je leren?",
      "options-proficiency_level": "Hoe vaardig ben je al in de taal? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.",
      "options-topics_of_interest": "Vul hieronder een aantal onderwerpen in die regelmatig terug kunnen komen in de oefening.",
      "options-api_code": 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model" om de oefening te maken en te beoordelen. Met welke aanbieder wil je een koppeling maken?',
      "options-api_credentials": "Voer de sleutel uit het ontwikkelaars paneel in.",
      "options-test_api_credentials": "Sleutel testen",
      "options-api_credentials_untested": "Test de gegevens eerst voordat je verder gaat.",
      "options-api_credentials_tested": 'De opgegeven sleutel werkt. Kies een "Large Language Model" dat je wilt gebruiken, wij raden "{%preferredModel%}" aan.',
      "statistics-activity_per_category": " Je hebt al {%s:statisticComprehensionActivity%} vragen beantwoord, {%s:statisticVocabularyActivity%} woorden geoefened, {%s:statisticConversationActivity%} berichten verstuurd, {%s:statisticStoryActivity%} verhalen verteld en {%s:statisticClarificationActivity%} vragen gesteld.",
      "statistics-no_activity": "Je hebt helaas nog niet genoeg activiteiten gedaan om hier weer te geven. Ga naar het overzicht en kies een oefening om te beginnen, op de achtergrond zal bijgehouden worden hoeveel je er al voltooid hebt.",
      "statistics-no_activity_streak": "Je hebt op dit momenten geen lopende activiteitenreeks opgebouwd. Deze krijg je door op meerdere dagen op een rij minimaal \xE9\xE9n oefening te doen.",
      "statistics-current_activity_streak": "Op dit moment is jouw activiteitenreeks {%s:statisticCurrentActivityStreak%} dagen lang. Verlies het niet en zorg ervoor dat je voor middernacht oefend!",
      "statistics-extended_activity_streak": "Goed gedaan, je hebt jouw reeks voor vandaag verlengt! Op dit moment is jouw activiteitenreeks {%s:statisticCurrentActivityStreak%} dagen lang.",
      "statistics-longest_activity_streak": " Jouw langste activiteitenreeks ooit was {%s:statisticLongestActivityStreak%} dagen lang.",
      "clarification-intro": "Waar wil je meer over weten?",
      "clarification-placeholder": "Ik vraag mij af...",
      "comprehension-intro": "Je leest straks een tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag erover, beantwoord de vraag in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord.",
      "conversation-intro": "Je gaat straks een gesprek simuleren in het {%t:{%s:targetLanguage%}%} zorg daarom dat je ook altijd in het {%t:{%s:targetLanguage%}%} antwoord. Tussendoor zal je enige verbeterpunten kunnen ontvangen.",
      "story-intro": "Je gaat straks een verhaal schrijven in het {%t:{%s:targetLanguage%}%} waarbij je omste beurten een stuk toevoegd. Maak je geen zorgen of het verhaal een goed, logisch en gegrond verhaal is, maar zorg vooral dat je de taal oefened. Zorg daarom dat je ook altijd in het {%t:{%s:targetLanguage%}%} antwoord. Tussendoor zal je enige verbeterpunten kunnen ontvangen.",
      "vocabulary-intro": "Je leest straks een woord samen met de definitie ervan in het {%t:{%s:targetLanguage%}%}. Antwoord met een zin waar het woord ingebruikt wordt in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord."
    }
  });
  var TRANSLATABLE_CODES = Object.keys(TRANSLATIONS);

  // src/screens/options.js
  var options = (state) => [
    node("b", translate(state, "greeting")),
    node("label", {
      for: "select_source_language"
    }, translate(state, "options-source_language")),
    node("select", {
      id: "select_source_language",
      change: (event) => {
        if (state.sourceLocale !== event.target.selectedOptions[0].value) {
          state.sourceLocale = event.target.selectedOptions[0].value;
          state.sourceLanguage = getLanguageFromLocale(state.sourceLocale);
        }
      }
    }, TRANSLATABLE_CODES.map(
      (localeCode) => node("option", {
        selected: state.sourceLocale === localeCode ? "selected" : false,
        value: localeCode
      }, translate(state, localeCode, localeCode))
    )),
    node("label", {
      for: "select_target_language"
    }, translate(state, "options-target_language")),
    node("select", {
      id: "select_target_language",
      change: (event) => {
        if (state.targetLocale !== event.target.selectedOptions[0].value) {
          state.targetLocale = event.target.selectedOptions[0].value;
          state.targetLanguage = getLanguageFromLocale(state.targetLocale);
        }
      }
    }, LOCALE_CODES.map(
      (localeCode) => node("option", {
        selected: state.targetLocale === localeCode ? "selected" : false,
        value: localeCode
      }, translate(state, localeCode))
    )),
    node("label", {
      for: "select_proficiency_level"
    }, translate(state, "options-proficiency_level")),
    node("select", {
      id: "select_proficiency_level",
      change: (event) => {
        if (state.proficiencyLevel !== event.target.selectedOptions[0].value) {
          state.proficiencyLevel = event.target.selectedOptions[0].value;
        }
      }
    }, PROFICIENCY_LEVEL_CODES.map(
      (proficiencyLevel) => node("option", {
        selected: state.proficiencyLevel === proficiencyLevel ? "selected" : false,
        value: proficiencyLevel
      }, translate(state, "proficiency_name-" + proficiencyLevel))
    )),
    node(
      "ul",
      translate(state, "proficiency_description-" + state.proficiencyLevel).map((text) => node("li", text))
    ),
    node(
      "blockquote",
      node("p", conditional(
        TRANSLATABLE_CODES.includes(state.targetLocale),
        translate(state, "proficiency_example-" + state.proficiencyLevel, state.targetLocale),
        translate(state, "proficiency_example-" + state.proficiencyLevel)
      ))
    ),
    node("label", {
      for: "input_topics_of_interest"
    }, translate(state, "options-topics_of_interest")),
    ...state.topicsOfInterest.map(
      (topic, index) => node("input", {
        keyup: (event) => {
          if (!event.target.value) {
            state.topicsOfInterest.splice(index, 1);
          } else {
            state.topicsOfInterest[index] = event.target.value;
          }
        },
        value: topic
      })
    ),
    node("input", {
      keyup: (event) => {
        if (event.target.value) {
          state.topicsOfInterest.push(event.target.value);
        }
      },
      id: "input_topics_of_interest"
    }),
    node("label", {
      for: "select_api_code"
    }, translate(state, "options-api_code")),
    node("select", {
      id: "select_api_code",
      change: (event) => {
        if (state.apiCode !== event.target.selectedOptions[0].value) {
          state.apiCode = event.target.selectedOptions[0].value;
          state.apiCredentialsTested = false;
        }
      }
    }, Object.keys(APIS).map(
      (apiCode) => node("option", {
        selected: state.apiCode === apiCode ? "selected" : false,
        value: apiCode
      }, APIS[apiCode].name)
    )),
    ...conditional(
      APIS[state.apiCode]?.requireCredentials,
      [
        node("label", {
          for: "input-api_credentials"
        }, translate(state, "options-api_credentials")),
        node("input", {
          id: "input-api_credentials",
          keyup: (event) => {
            if (state.apiCredentials !== event.target.value) {
              state.apiCredentials = event.target.value;
            }
          },
          type: "password",
          value: state.apiCredentials
        })
      ]
    ),
    node("button", {
      click: () => {
        state.apiCredentialsPending = true;
        getModels5(state).then(([error, response, result]) => {
          state.apiCredentialsPending = false;
          if (error) {
            state.apiCredentialsTested = false;
            state.apiCredentialsError = error.toString();
            state.apiModels = null;
          } else {
            state.apiCredentialsTested = true;
            state.apiCredentialsError = false;
            state.apiModels = result;
          }
        });
      },
      type: "button"
    }, [
      translate(state, "options-test_api_credentials"),
      node("span", {
        class: state.apiCredentialsPending ? "pending" : ""
      })
    ]),
    ...conditional(
      state.apiCredentialsError,
      [node("p", state.apiCredentialsError)]
    ),
    ...conditional(
      !state.apiCredentialsTested,
      [node("p", translate(state, "options-api_credentials_untested"))],
      [
        node("label", {
          for: "select_api_model"
        }, translate(state, "options-api_credentials_tested").replace("{%preferredModel%}", APIS[state.apiCode]?.preferredModelName ?? APIS[state.apiCode]?.preferredModel)),
        node("select", {
          id: "select_api_model",
          change: (event) => {
            if (state.apiModel !== event.target.selectedOptions[0].value) {
              state.apiModel = event.target.selectedOptions[0].value;
            }
          }
        }, [
          node("option", {
            disabled: true,
            selected: !isReady(state) ? "selected" : false,
            value: null
          }, translate(state, "select_an_option")),
          ...state.apiModels?.data?.filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true))?.sort((a, b) => a.id.localeCompare(b.id))?.map((model) => node("option", {
            selected: (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id ? "selected" : false,
            value: model.id
          }, model.name ?? model.id)) ?? []
        ])
      ]
    ),
    node("button", {
      click: () => {
        if (isReady(state)) {
          state.screen = SCREENS.overview;
        }
      },
      disabled: !isReady(state),
      type: "button"
    }, translate(state, "button-go_back"))
  ];

  // src/screens/overview.js
  var overview = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      ...conditional(
        state.statisticComprehensionActivity > 0 || state.statisticConversationActivity > 0 || state.statisticClarificationActivity > 0 || state.statisticStoryActivity > 0 || state.statisticVocabularyActivity > 0,
        translate(state, "statistics-activity_per_category"),
        translate(state, "statistics-no_activity")
      )
    ]),
    node("p", [
      ...conditional(
        state.statisticCurrentActivityStreak > 1 && (new Date(state.statisticLastActivityOn).toISOString().slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10) || new Date(state.statisticLastActivityOn).toISOString().slice(0, 10) === new Date((/* @__PURE__ */ new Date()).setDate((/* @__PURE__ */ new Date()).getDate() - 1)).toISOString().slice(0, 10)),
        [
          ...conditional(
            new Date(state.statisticLastActivityOn).toISOString().slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
            translate(state, "statistics-extended_activity_streak"),
            translate(state, "statistics-current_activity_streak")
          ),
          ...conditional(
            state.statisticLongestActivityStreak > state.statisticCurrentActivityStreak,
            " " + translate(state, "statistics-longest_activity_streak")
          )
        ],
        [
          translate(state, "statistics-no_activity_streak"),
          ...conditional(
            state.statisticLongestActivityStreak > 1,
            " " + translate(state, "statistics-longest_activity_streak")
          )
        ]
      ),
      " " + translate(state, "overview-intro")
    ]),
    node("div", {
      class: "vertical-layout"
    }, [
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.comprehension;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u{1F4D6}"),
        node("b", translate(state, "overview-comprehension-title")),
        node("br"),
        translate(state, "overview-comprehension-description")
      ]),
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.vocabulary;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u{1F50E}"),
        node("b", translate(state, "overview-vocabulary-title")),
        node("br"),
        translate(state, "overview-vocabulary-description")
      ]),
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.conversation;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u{1F4AC}"),
        node("b", translate(state, "overview-conversation-title")),
        node("br"),
        translate(state, "overview-conversation-description")
      ]),
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.story;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u{1F3AD}"),
        node("b", translate(state, "overview-story-title")),
        node("br"),
        translate(state, "overview-story-description")
      ]),
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.clarification;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u{1F64B}"),
        node("b", translate(state, "overview-clarification-title")),
        node("br"),
        translate(state, "overview-clarification-description")
      ]),
      node("div", {
        class: "margin"
      }),
      node("button", {
        class: "card",
        click: () => {
          state.screen = SCREENS.options;
        },
        type: "button"
      }, [
        node("span", {
          class: "icon"
        }, "\u2699\uFE0F"),
        node("b", translate(state, "overview-options-title")),
        node("br"),
        translate(state, "overview-options-description")
      ]),
      node("p", {
        class: "text-right"
      }, node("a", {
        href: "https://rondekker.com/",
        target: "_blank",
        rel: "noopener me"
      }, translate(state, "credits-link").replace("{%name%}", "Ron Dekker")))
    ])
  ];

  // src/screens/setup.js
  var setup = (state) => [
    node("b", translate(state, "greeting")),
    node("label", {
      for: "select_source_language"
    }, translate(state, "setup-source_language")),
    node("select", {
      id: "select_source_language",
      change: (event) => {
        if (state.sourceLocale !== event.target.selectedOptions[0].value) {
          state.sourceLocale = event.target.selectedOptions[0].value;
          state.sourceLanguage = getLanguageFromLocale(state.sourceLocale);
        }
      }
    }, TRANSLATABLE_CODES.map(
      (localeCode) => node("option", {
        selected: state.sourceLocale === localeCode ? "selected" : false,
        value: localeCode
      }, translate(state, localeCode, localeCode))
    )),
    node("label", {
      for: "select_target_language"
    }, translate(state, "setup-target_language")),
    node("select", {
      id: "select_target_language",
      change: (event) => {
        if (state.targetLocale !== event.target.selectedOptions[0].value) {
          state.targetLocale = event.target.selectedOptions[0].value;
          state.targetLanguage = getLanguageFromLocale(state.targetLocale);
        }
      }
    }, LOCALE_CODES.map(
      (localeCode) => node("option", {
        selected: state.targetLocale === localeCode ? "selected" : false,
        value: localeCode
      }, translate(state, localeCode))
    )),
    node("label", {
      for: "select_proficiency_level"
    }, translate(state, "setup-proficiency_level")),
    node("select", {
      id: "select_proficiency_level",
      change: (event) => {
        if (state.proficiencyLevel !== event.target.selectedOptions[0].value) {
          state.proficiencyLevel = event.target.selectedOptions[0].value;
        }
      }
    }, PROFICIENCY_LEVEL_CODES.map(
      (proficiencyLevel) => node("option", {
        selected: state.proficiencyLevel === proficiencyLevel ? "selected" : false,
        value: proficiencyLevel
      }, translate(state, "proficiency_name-" + proficiencyLevel))
    )),
    node(
      "ul",
      translate(state, "proficiency_description-" + state.proficiencyLevel).map((text) => node("li", text))
    ),
    node(
      "blockquote",
      node("p", conditional(
        TRANSLATABLE_CODES.includes(state.targetLocale),
        translate(state, "proficiency_example-" + state.proficiencyLevel, state.targetLocale),
        translate(state, "proficiency_example-" + state.proficiencyLevel)
      ))
    ),
    node("label", {
      for: "input_topics_of_interest"
    }, translate(state, "setup-topics_of_interest")),
    ...state.topicsOfInterest.map(
      (topic, index) => node("input", {
        keyup: (event) => {
          if (!event.target.value) {
            state.topicsOfInterest.splice(index, 1);
          } else {
            state.topicsOfInterest[index] = event.target.value;
          }
        },
        value: topic
      })
    ),
    node("input", {
      keyup: (event) => {
        if (event.target.value) {
          state.topicsOfInterest.push(event.target.value);
        }
      },
      id: "input_topics_of_interest"
    }),
    node("label", {
      for: "select_api_code"
    }, translate(state, "setup-api_code")),
    node("select", {
      id: "select_api_code",
      change: (event) => {
        if (state.apiCode !== event.target.selectedOptions[0].value) {
          state.apiCode = event.target.selectedOptions[0].value;
          state.apiCredentialsTested = false;
        }
      }
    }, Object.keys(APIS).map(
      (apiCode) => node("option", {
        selected: state.apiCode === apiCode ? "selected" : false,
        value: apiCode
      }, APIS[apiCode].name)
    )),
    ...conditional(
      APIS[state.apiCode]?.requireCredentials,
      [
        node("label", {
          for: "input-api_credentials"
        }, translate(state, "setup-api_credentials")),
        node("input", {
          id: "input-api_credentials",
          keyup: (event) => {
            if (state.apiCredentials !== event.target.value) {
              state.apiCredentials = event.target.value;
            }
          },
          type: "password",
          value: state.apiCredentials
        })
      ]
    ),
    node("button", {
      click: () => {
        state.apiCredentialsPending = true;
        getModels5(state).then(([error, response, result]) => {
          state.apiCredentialsPending = false;
          if (error) {
            state.apiCredentialsTested = false;
            state.apiCredentialsError = error.toString();
            state.apiModels = null;
          } else {
            state.apiCredentialsTested = true;
            state.apiCredentialsError = false;
            state.apiModels = result;
            state.apiModel ??= result?.data.length > 0 ? result.data[0].id : null;
          }
        });
      },
      type: "button"
    }, [
      translate(state, "setup-test_api_credentials"),
      node("span", {
        class: state.apiCredentialsPending ? "pending" : ""
      })
    ]),
    ...conditional(
      state.apiCredentialsError,
      [node("p", state.apiCredentialsError)]
    ),
    ...conditional(
      !state.apiCredentialsTested,
      [node("p", translate(state, "setup-api_credentials_untested"))],
      [
        node("label", {
          for: "select_api_model"
        }, translate(state, "setup-api_credentials_tested").replace("{%preferredModel%}", APIS[state.apiCode]?.preferredModelName ?? APIS[state.apiCode]?.preferredModel)),
        node("select", {
          id: "select_api_model",
          change: (event) => {
            if (state.apiModel !== event.target.selectedOptions[0].value) {
              state.apiModel = event.target.selectedOptions[0].value;
            }
          }
        }, [
          node("option", {
            disabled: true,
            selected: !isReady(state) ? "selected" : false,
            value: null
          }, translate(state, "select_an_option")),
          ...state.apiModels?.data?.filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true))?.sort((a, b) => a.id.localeCompare(b.id))?.map((model) => node("option", {
            selected: (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id ? "selected" : false,
            value: model.id
          }, model.name ?? model.id)) ?? []
        ])
      ]
    ),
    ...conditional(
      isReady(state),
      [node("p", translate(state, "setup-outro"))]
    ),
    node("button", {
      click: () => {
        if (isReady(state)) {
          state.screen = SCREENS.overview;
        }
      },
      disabled: !isReady(state),
      type: "button"
    }, translate(state, "setup-next"))
  ];

  // src/utilities/streak.js
  var ONE_HOUR = 60 * 60 * 1e3;
  var ONE_DAY = ONE_HOUR * 24;
  var TWO_DAYS = ONE_DAY * 2;
  var GRACE_PERIOD = ONE_HOUR;
  var onActivity2 = (state) => {
    const lastActivityOn = new Date(state.statisticLastActivityOn);
    const lastActivityUTC = Date.UTC(
      lastActivityOn.getFullYear(),
      lastActivityOn.getMonth(),
      lastActivityOn.getDate()
    );
    const today = /* @__PURE__ */ new Date();
    const todayUTC = Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const deltaTime = todayUTC - lastActivityUTC;
    if (deltaTime >= TWO_DAYS + GRACE_PERIOD) {
      state.statisticCurrentActivityStreak = 1;
      state.statisticLastActivityOn = today.toISOString();
    } else if (deltaTime >= ONE_DAY) {
      state.statisticCurrentActivityStreak++;
      state.statisticLastActivityOn = today.toISOString();
    }
    if (state.statisticCurrentActivityStreak > state.statisticLongestActivityStreak) {
      state.statisticLongestActivityStreak = state.statisticCurrentActivityStreak;
    }
  };

  // src/utilities/random.js
  var randomBool = (odds) => {
    odds = Math.abs(odds);
    return Math.random() < 1 / odds;
  };
  var randomItem = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  };

  // src/screens/conversation.js
  var conversation = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      translate(state, "conversation-intro")
    ]),
    ...conditional(
      state.conversationMessages && state.conversationMessages.length > 0,
      node("div", {
        class: "messages"
      }, state.conversationMessages.map(
        (message) => node("p", {
          class: "message-" + message?.role
        }, message?.content?.split("\n")?.flatMap(
          (content, index, results) => index === results.length - 1 ? [content] : [content, node("br")]
        ))
      ))
    ),
    ...conditional(
      state.conversationError,
      node("p", state.conversationError)
    ),
    ...conditional(
      state.conversationPending,
      node("p", {
        class: "pending"
      }),
      conditional(
        state.conversationMessages && state.conversationMessages.length > 0,
        node("textarea", {
          class: "message-user",
          id: "input-question",
          keyup: (event) => {
            state.conversationInput = event.target.value;
          }
        }, state.conversationInput)
      )
    ),
    node("div", {
      class: "row reverse"
    }, [
      ...conditional(
        state.conversationMessages && state.conversationMessages.length > 0 && !state.conversationStopped,
        node("button", {
          disabled: state.conversationPending || !state.conversationInput || state.conversationInput.trim().length === 0,
          type: "button",
          click: () => {
            if (!state.conversationPending && state.conversationInput && state.conversationInput.trim().length > 0) {
              state.conversationError = false;
              state.conversationPending = true;
              state.conversationMessages.push({
                role: "user",
                content: state.conversationInput.trim()
              });
              state.conversationInput = "";
              createMessage5(
                state,
                state.conversationMessages,
                translate(state, "prompt-context"),
                translate(state, "prompt-conversation-follow_up")
              ).then(([error, response, result]) => {
                state.conversationPending = false;
                if (error) {
                  state.conversationError = error.toString();
                  const message = state.conversationMessages.pop();
                  state.conversationInput = message.content;
                  return;
                }
                if (result.content.trim().endsWith("STOP")) {
                  state.conversationStopped = true;
                }
                state.conversationMessages.push(result);
                state.statisticConversationActivity++;
                onActivity2(state);
              });
            }
          }
        }, translate(state, "button-reply")),
        node("button", {
          disabled: state.conversationPending,
          type: "button",
          click: () => {
            if (!state.conversationPending) {
              state.conversationError = false;
              state.conversationMessages = [];
              state.conversationPending = true;
              createMessage5(
                state,
                [],
                translate(state, "prompt-context"),
                translate(state, "prompt-conversation") + (randomBool(10) ? translate(state, "prompt-topic").replace("{%topic%}", randomItem(
                  state.topicsOfInterest.filter((topic) => topic)
                )) : "")
              ).then(([error, response, result]) => {
                state.conversationPending = false;
                if (error) {
                  state.conversationError = error.toString();
                  return;
                }
                state.conversationMessages.push(result);
              });
            }
          }
        }, translate(state, "button-generate"))
      ),
      ...conditional(
        state.conversationPending || state.conversationMessages && state.conversationMessages.length > 0,
        node("button", {
          click: () => {
            state.conversationError = false;
            state.conversationMessages = [];
            state.conversationPending = false;
            state.conversationStopped = false;
          },
          type: "button"
        }, translate(state, "button-reset"))
      ),
      node("button", {
        click: () => {
          state.screen = SCREENS.overview;
        },
        type: "button"
      }, translate(state, "button-go_back"))
    ])
  ];

  // src/screens/clarification.js
  var clarification = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      node("label", {
        for: "input-question"
      }, translate(state, "clarification-intro"))
    ]),
    ...conditional(
      state.clarificationMessages && state.clarificationMessages.length > 0,
      node("div", {
        class: "messages"
      }, state.clarificationMessages.map(
        (message) => node("p", {
          class: "message-" + message?.role
        }, message?.content?.split("\n")?.flatMap(
          (content, index, results) => index === results.length - 1 ? [content] : [content, node("br")]
        ))
      ))
    ),
    ...conditional(
      state.clarificationError,
      node("p", state.clarificationError)
    ),
    ...conditional(
      state.clarificationPending,
      node("p", {
        class: "pending"
      }),
      node("textarea", {
        class: "message-user",
        id: "input-question",
        placeholder: translate(state, "clarification-placeholder"),
        keyup: (event) => {
          state.clarificationInput = event.target.value;
        }
      }, state.clarificationInput)
    ),
    node("div", {
      class: "row reverse"
    }, [
      node("button", {
        disabled: state.clarificationPending || !state.clarificationInput || state.clarificationInput.trim().length === 0,
        type: "button",
        click: () => {
          if (!state.clarificationPending && state.clarificationInput && state.clarificationInput.trim().length > 0) {
            state.clarificationError = false;
            state.clarificationPending = true;
            state.clarificationMessages.push({
              role: "user",
              content: state.clarificationInput.trim()
            });
            state.clarificationInput = "";
            createMessage5(
              state,
              state.clarificationMessages,
              translate(state, "prompt-context"),
              translate(state, "prompt-clarification")
            ).then(([error, response, result]) => {
              state.clarificationPending = false;
              if (error) {
                state.clarificationError = error.toString();
                const message = state.clarificationMessages.pop();
                state.clarificationInput = message.content;
                return;
              }
              state.clarificationMessages.push(result);
              state.statisticClarificationActivity++;
              onActivity(state);
            });
          }
        }
      }, translate(state, "button-ask")),
      ...conditional(
        state.clarificationPending || state.clarificationMessages && state.clarificationMessages.length > 0,
        node("button", {
          type: "button",
          click: () => {
            state.clarificationError = false;
            state.clarificationMessages = [];
            state.clarificationPending = false;
          }
        }, translate(state, "button-reset"))
      ),
      node("button", {
        type: "button",
        click: () => {
          state.screen = SCREENS.overview;
        }
      }, translate(state, "button-go_back"))
    ])
  ];

  // src/screens/comprehension.js
  var comprehension = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      translate(state, "comprehension-intro")
    ]),
    ...conditional(
      state.comprehensionMessages && state.comprehensionMessages.length > 0,
      node("div", {
        class: "messages"
      }, state.comprehensionMessages.map(
        (message) => node("p", {
          class: "message-" + message?.role
        }, message?.content?.split("\n")?.flatMap(
          (content, index, results) => index === results.length - 1 ? [content] : [content, node("br")]
        ))
      ))
    ),
    ...conditional(
      state.comprehensionError,
      node("p", state.comprehensionError)
    ),
    ...conditional(
      state.comprehensionPending,
      node("p", {
        class: "pending"
      }),
      conditional(
        state.comprehensionMessages && state.comprehensionMessages.length > 0 && state.comprehensionMessages.length < 3,
        node("textarea", {
          class: "message-user",
          id: "input-question",
          keyup: (event) => {
            state.comprehensionInput = event.target.value;
          }
        }, state.comprehensionInput)
      )
    ),
    node("div", {
      class: "row reverse"
    }, [
      ...conditional(
        state.comprehensionMessages && state.comprehensionMessages.length > 0 && state.comprehensionMessages.length < 3,
        node("button", {
          disabled: state.comprehensionPending || !state.comprehensionInput || state.comprehensionInput.trim().length === 0,
          type: "button",
          click: () => {
            if (!state.comprehensionPending && state.comprehensionInput && state.comprehensionInput.trim().length > 0) {
              state.comprehensionError = false;
              state.comprehensionPending = true;
              state.comprehensionMessages.push({
                role: "user",
                content: state.comprehensionInput.trim()
              });
              state.comprehensionInput = "";
              createMessage5(
                state,
                state.comprehensionMessages,
                translate(state, "prompt-context"),
                translate(state, "prompt-comprehension-follow_up")
              ).then(([error, response, result]) => {
                state.comprehensionPending = false;
                if (error) {
                  state.comprehensionError = error.toString();
                  const message = state.comprehensionMessages.pop();
                  state.comprehensionInput = message.content;
                  return;
                }
                state.comprehensionMessages.push(result);
                state.statisticComprehensionActivity++;
                onActivity2(state);
              });
            }
          }
        }, translate(state, "button-answer")),
        node("button", {
          disabled: state.comprehensionPending,
          type: "button",
          click: () => {
            if (!state.comprehensionPending) {
              state.comprehensionError = false;
              state.comprehensionMessages = [];
              state.comprehensionPending = true;
              createMessage5(
                state,
                [],
                translate(state, "prompt-context"),
                translate(state, "prompt-comprehension") + (randomBool(10) ? translate(state, "prompt-topic").replace("{%topic%}", randomItem(
                  state.topicsOfInterest.filter((topic) => topic)
                )) : "")
              ).then(([error, response, result]) => {
                state.comprehensionPending = false;
                if (error) {
                  state.comprehensionError = error.toString();
                  return;
                }
                state.comprehensionMessages.push(result);
              });
            }
          }
        }, translate(state, "button-generate"))
      ),
      ...conditional(
        state.comprehensionPending || state.comprehensionMessages && state.comprehensionMessages.length > 0,
        node("button", {
          click: () => {
            state.comprehensionError = false;
            state.comprehensionMessages = [];
            state.comprehensionPending = false;
          },
          type: "button"
        }, translate(state, "button-reset"))
      ),
      node("button", {
        click: () => {
          state.screen = SCREENS.overview;
        },
        type: "button"
      }, translate(state, "button-go_back"))
    ])
  ];

  // src/screens/story.js
  var story = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      translate(state, "story-intro")
    ]),
    ...conditional(
      state.storyMessages && state.storyMessages.length > 0,
      node("div", {
        class: "messages"
      }, state.storyMessages.map(
        (message) => node("p", {
          class: "message-" + message?.role
        }, message?.content?.split("\n")?.flatMap(
          (content, index, results) => index === results.length - 1 ? [content] : [content, node("br")]
        ))
      ))
    ),
    ...conditional(
      state.storyError,
      node("p", state.storyError)
    ),
    ...conditional(
      state.storyPending,
      node("p", {
        class: "pending"
      }),
      conditional(
        state.storyMessages && state.storyMessages.length > 0,
        node("textarea", {
          class: "message-user",
          id: "input-question",
          keyup: (event) => {
            state.storyInput = event.target.value;
          }
        }, state.storyInput)
      )
    ),
    node("div", {
      class: "row reverse"
    }, [
      ...conditional(
        state.storyMessages && state.storyMessages.length > 0 && !state.storyStopped,
        node("button", {
          disabled: state.storyPending || !state.storyInput || state.storyInput.trim().length === 0,
          type: "button",
          click: () => {
            if (!state.storyPending && state.storyInput && state.storyInput.trim().length > 0) {
              state.storyError = false;
              state.storyPending = true;
              state.storyMessages.push({
                role: "user",
                content: state.storyInput.trim()
              });
              state.storyInput = "";
              createMessage5(
                state,
                state.storyMessages,
                translate(state, "prompt-context"),
                translate(state, "prompt-story-follow_up")
              ).then(([error, response, result]) => {
                state.storyPending = false;
                if (error) {
                  state.storyError = error.toString();
                  const message = state.storyMessages.pop();
                  state.storyInput = message.content;
                  return;
                }
                if (result.content.endsWith("STOP")) {
                  state.storyStopped = true;
                }
                state.storyMessages.push(result);
                state.statisticStoryActivity++;
                onActivity2(state);
              });
            }
          }
        }, translate(state, "button-reply")),
        node("button", {
          disabled: state.storyPending,
          type: "button",
          click: () => {
            if (!state.storyPending) {
              state.storyError = false;
              state.storyMessages = [];
              state.storyPending = true;
              createMessage5(
                state,
                [],
                translate(state, "prompt-context"),
                translate(state, "prompt-story") + (randomBool(10) ? translate(state, "prompt-topic").replace("{%topic%}", randomItem(
                  state.topicsOfInterest.filter((topic) => topic)
                )) : "")
              ).then(([error, response, result]) => {
                state.storyPending = false;
                if (error) {
                  state.storyError = error.toString();
                  return;
                }
                state.storyMessages.push(result);
              });
            }
          }
        }, translate(state, "button-generate"))
      ),
      ...conditional(
        state.storyPending || state.storyMessages && state.storyMessages.length > 0,
        node("button", {
          click: () => {
            state.storyError = false;
            state.storyMessages = [];
            state.storyPending = false;
            state.storyStopped = false;
          },
          type: "button"
        }, translate(state, "button-reset"))
      ),
      node("button", {
        click: () => {
          state.screen = SCREENS.overview;
        },
        type: "button"
      }, translate(state, "button-go_back"))
    ])
  ];

  // src/screens/vocabulary.js
  var vocabulary = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      translate(state, "vocabulary-intro")
    ]),
    ...conditional(
      state.vocabularyMessages && state.vocabularyMessages.length > 0,
      node("div", {
        class: "messages"
      }, state.vocabularyMessages.map(
        (message) => node("p", {
          class: "message-" + message?.role
        }, message?.content?.split("\n")?.flatMap(
          (content, index, results) => index === results.length - 1 ? [content] : [content, node("br")]
        ))
      ))
    ),
    ...conditional(
      state.vocabularyError,
      node("p", state.vocabularyError)
    ),
    ...conditional(
      state.vocabularyPending,
      node("p", {
        class: "pending"
      }),
      conditional(
        state.vocabularyMessages && state.vocabularyMessages.length > 0 && state.vocabularyMessages.length < 3,
        node("textarea", {
          class: "message-user",
          id: "input-question",
          keyup: (event) => {
            state.vocabularyInput = event.target.value;
          }
        }, state.vocabularyInput)
      )
    ),
    node("div", {
      class: "row reverse"
    }, [
      ...conditional(
        state.vocabularyMessages && state.vocabularyMessages.length > 0 && state.vocabularyMessages.length < 3,
        node("button", {
          disabled: state.vocabularyPending || !state.vocabularyInput || state.vocabularyInput.trim().length === 0,
          type: "button",
          click: () => {
            if (!state.vocabularyPending && state.vocabularyInput && state.vocabularyInput.trim().length > 0) {
              state.vocabularyError = false;
              state.vocabularyPending = true;
              state.vocabularyMessages.push({
                role: "user",
                content: state.vocabularyInput.trim()
              });
              state.vocabularyInput = "";
              createMessage5(
                state,
                state.vocabularyMessages,
                translate(state, "prompt-context"),
                translate(state, "prompt-vocabulary-follow_up")
              ).then(([error, response, result]) => {
                state.vocabularyPending = false;
                if (error) {
                  state.vocabularyError = error.toString();
                  const message = state.vocabularyMessages.pop();
                  state.vocabularyInput = message.content;
                  return;
                }
                state.vocabularyMessages.push(result);
                state.statisticVocabularyActivity++;
                onActivity2(state);
              });
            }
          }
        }, translate(state, "button-answer")),
        node("button", {
          disabled: state.vocabularyPending,
          type: "button",
          click: () => {
            if (!state.vocabularyPending) {
              state.vocabularyError = false;
              state.vocabularyMessages = [];
              state.vocabularyPending = true;
              createMessage5(
                state,
                [],
                translate(state, "prompt-context"),
                translate(state, "prompt-vocabulary")
              ).then(([error, response, result]) => {
                state.vocabularyPending = false;
                if (error) {
                  state.vocabularyError = error.toString();
                  return;
                }
                state.vocabularyMessages.push(result);
              });
            }
          }
        }, translate(state, "button-generate"))
      ),
      ...conditional(
        state.vocabularyPending || state.vocabularyMessages && state.vocabularyMessages.length > 0,
        node("button", {
          click: () => {
            state.vocabularyError = false;
            state.vocabularyMessages = [];
            state.vocabularyPending = false;
          },
          type: "button"
        }, translate(state, "button-reset"))
      ),
      node("button", {
        click: () => {
          state.screen = SCREENS.overview;
        },
        type: "button"
      }, translate(state, "button-go_back"))
    ])
  ];

  // src/utilities/identifiers.js
  var IDENTIFIER_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var createIdentifier = (length) => {
    let result = "";
    const charactersLength = IDENTIFIER_CHARACTERS.length;
    let counter = 0;
    while (counter < length) {
      result += IDENTIFIER_CHARACTERS.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  };

  // src/app.js
  var STATE_KEY = "toaln:state";
  var preferredLocale = getPreferredLocale();
  mount(
    document.getElementById("app"),
    (state) => {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
      document.documentElement.setAttribute("lang", state.sourceLocale);
      return node("div", {
        class: "screen"
      }, match(state.screen, {
        [SCREENS.options]: () => options(state),
        [SCREENS.overview]: () => overview(state),
        [SCREENS.clarification]: () => clarification(state),
        [SCREENS.comprehension]: () => comprehension(state),
        [SCREENS.conversation]: () => conversation(state),
        [SCREENS.story]: () => story(state),
        [SCREENS.vocabulary]: () => vocabulary(state)
      }, () => setup(state)));
    },
    Object.assign({
      screen: SCREENS.setup,
      userIdentifier: createIdentifier(),
      sourceLocale: preferredLocale,
      sourceLanguage: getLanguageFromLocale(preferredLocale),
      targetLocale: LOCALES.eng,
      targetLanguage: getLanguageFromLocale(LOCALES.eng),
      proficiencyLevel: PROFICIENCY_LEVELS.a1,
      topicsOfInterest: [],
      apiCode: APIS.google.code,
      apiModel: apiSettings3.preferredModel,
      apiCredentials: null,
      apiCredentialsError: false,
      apiCredentialsTested: false,
      apiCredentialsPending: false,
      statisticComprehensionActivity: 0,
      statisticConversationActivity: 0,
      statisticClarificationActivity: 0,
      statisticStoryActivity: 0,
      statisticVocabularyActivity: 0,
      statisticLastActivityOn: null,
      statisticCurrentActivityStreak: 0,
      statisticLongestActivityStreak: 0,
      clarificationInput: "",
      clarificationError: false,
      clarificationPending: false,
      clarificationMessages: [],
      comprehensionInput: "",
      comprehensionReviewed: false,
      comprehensionError: false,
      comprehensionPending: false,
      comprehensionMessages: [],
      conversationInput: "",
      conversationStopped: false,
      conversationError: false,
      conversationPending: false,
      conversationMessages: [],
      storyInput: "",
      storyReviewed: false,
      storyError: false,
      storyPending: false,
      storyMessages: [],
      vocabularyInput: "",
      vocabularyReviewed: false,
      vocabularyError: false,
      vocabularyPending: false,
      vocabularyMessages: []
    }, localStorage.getItem(STATE_KEY) ? JSON.parse(localStorage.getItem(STATE_KEY)) : {})
  );
})();
//# sourceMappingURL=app.js.map
