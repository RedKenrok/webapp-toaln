(() => {
  // node_modules/@doars/staark/dst/staark.js
  var arrayify = function(data) {
    if (Array.isArray(data)) {
      return data;
    }
    return [
      data
    ];
  };
  var conditional = (condition, onTruth, onFalse) => {
    if (condition) {
      return arrayify(onTruth);
    }
    return arrayify(onFalse ?? []);
  };
  var marker = Symbol();
  var node = (type, attributesOrContents, contents) => {
    if (typeof attributesOrContents !== "object" || attributesOrContents._ === marker || Array.isArray(attributesOrContents)) {
      contents = attributesOrContents;
      attributesOrContents = void 0;
    }
    return {
      _: marker,
      a: attributesOrContents,
      c: contents ? Array.isArray(contents) ? contents : [contents] : [],
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
  var equalRecursive = (valueA, valueB) => {
    if (valueA === valueB) {
      return true;
    }
    if (valueA instanceof Date && valueB instanceof Date) {
      return valueA.getTime() === valueB.getTime();
    }
    if (!valueA || !valueB || typeof valueA !== "object" && typeof valueB !== "object") {
      return valueA === valueB;
    }
    if (valueA === null || valueA === void 0 || valueB === null || valueB === void 0) {
      return false;
    }
    if (valueA.prototype !== valueB.prototype) {
      return false;
    }
    let keys = Object.keys(valueA);
    if (keys.length !== Object.keys(valueB).length) {
      return false;
    }
    return keys.every(
      (key) => equalRecursive(valueA[key], valueB[key])
    );
  };
  var childrenToNodes = (element) => {
    const abstractChildNodes = [];
    for (let i = 0; i < element.childNodes.length; i++) {
      const childNode = element.childNodes[i];
      if (childNode instanceof Text) {
        abstractChildNodes.push(
          childNode.textContent ?? ""
        );
      } else {
        let attributes = {};
        for (let i2 = 0; i2 < childNode.attributes.length; i2++) {
          const attribute = childNode.attributes[i2];
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
    const map = /* @__PURE__ */ new WeakMap();
    const remove = (target) => {
      if (map.has(target)) {
        const revocable = map.get(target);
        map.delete(revocable);
        for (const property in revocable.proxy) {
          if (typeof revocable.proxy[property] === "object") {
            remove(revocable.proxy[property]);
          }
        }
        revocable.revoke();
      }
    };
    const add = (target) => {
      if (map.has(target)) {
        return map.get(target);
      }
      for (const key in target) {
        if (target[key] && typeof target[key] === "object") {
          target[key] = add(target[key]);
        }
      }
      const revocable = Proxy.revocable(target, {
        deleteProperty: (target2, key) => {
          if (Reflect.has(target2, key)) {
            remove(target2);
            const deleted = Reflect.deleteProperty(target2, key);
            if (deleted) {
              onChange();
            }
            return deleted;
          }
          return true;
        },
        set: (target2, key, value) => {
          const existingValue = target2[key];
          if (existingValue !== value) {
            if (typeof existingValue === "object") {
              remove(existingValue);
            }
            if (value && typeof value === "object") {
              value = add(value);
            }
            target2[key] = value;
            onChange();
          }
          return true;
        }
      });
      map.set(revocable, target);
      return revocable.proxy;
    };
    return add(root);
  };
  var MATCH_CAPITALS = /[A-Z]+(?![a-z])|[A-Z]/g;
  var HYPHENATE = (part, offset) => (offset ? "-" : "") + part;
  var mount = (rootElement, renderView, initialState, oldAbstractTree) => {
    let listenerCount = 0;
    const updateAttributes = (element, newAttributes, oldAttributes) => {
      if (newAttributes) {
        for (const name in newAttributes) {
          let value = newAttributes[name];
          if (value) {
            const type = typeof value;
            if (type === "function") {
              const listener = newAttributes[name] = (event) => {
                listenerCount++;
                try {
                  value(event);
                } catch (error) {
                  console.error("listener error", error);
                }
                listenerCount--;
                updateAbstracts();
              };
              element.addEventListener(name, listener);
              continue;
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
              } else if (name === "style") {
                if (typeof value === "object") {
                  if (Array.isArray(value)) {
                    value = value.join(";");
                  } else {
                    let styles = "";
                    for (let styleProperty in value) {
                      let styleValue = value[styleProperty];
                      styleProperty = styleProperty.replace(MATCH_CAPITALS, HYPHENATE).toLowerCase();
                      if (Array.isArray(styleValue)) {
                        styles += ";" + styleProperty + ":" + styleValue.join(" ");
                      } else if (styleValue) {
                        styles += ";" + styleProperty + ":" + styleValue;
                      }
                    }
                    value = styles;
                  }
                }
              } else {
                if (type === "boolean") {
                  if (!value) {
                    element.removeAttribute(name);
                    continue;
                  }
                  value = "true";
                } else if (type !== "string") {
                  value = value.toString();
                }
                if (name === "value" && element.value !== value) {
                  element.value = value;
                } else if (name === "checked") {
                  element.checked = newAttributes[name];
                }
              }
              element.setAttribute(name, value);
            }
          }
        }
      }
      if (oldAttributes) {
        for (const name in oldAttributes) {
          if (typeof oldAttributes[name] === "function") {
            element.removeEventListener(
              name,
              oldAttributes[name]
            );
          } else if (!newAttributes || !(name in newAttributes) || !newAttributes[name]) {
            if (name === "value") {
              element.value = "";
            } else if (name === "checked") {
              element.checked = false;
            }
            element.removeAttribute(name);
          }
        }
      }
    };
    let oldMemoList = [];
    let newMemoList = [];
    const resolveMemoization = (memoAbstract) => {
      let match2 = oldMemoList.find((oldMemo) => oldMemo.r === memoAbstract.r && equalRecursive(oldMemo.m, memoAbstract.m));
      if (!match2) {
        match2 = {
          c: arrayify(
            memoAbstract.r(
              state,
              memoAbstract.m
            )
          ),
          m: memoAbstract.m,
          r: memoAbstract.r
        };
      }
      if (!newMemoList.includes(match2)) {
        newMemoList.push(match2);
      }
      return structuredClone(
        match2.c
      );
    };
    const updateElementTree = (element, newChildAbstracts, oldChildAbstracts, elementAbstract) => {
      let newIndex = 0;
      let newCount = 0;
      if (newChildAbstracts) {
        for (; newIndex < newChildAbstracts.length; newIndex++) {
          const newAbstract = newChildAbstracts[newIndex];
          if (newAbstract.r) {
            const memoAbstracts = resolveMemoization(
              newAbstract
            );
            newChildAbstracts.splice(
              newIndex,
              1,
              ...memoAbstracts
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
                    ...oldChildAbstracts.splice(
                      oldIndex,
                      1
                    )
                  );
                }
                if (newAbstract.t) {
                  updateAttributes(
                    element.childNodes[newIndex],
                    newAbstract.a,
                    oldAbstract.a
                  );
                  updateElementTree(
                    element.childNodes[newIndex],
                    newAbstract.c,
                    oldAbstract.c,
                    oldAbstract
                  );
                } else {
                  element.childNodes[newIndex].textContent = typeof newAbstract === "string" ? newAbstract : newAbstract.c;
                }
                break;
              }
            }
          }
          if (!matched) {
            let childElement;
            if (newAbstract.t) {
              childElement = document.createElement(
                newAbstract.t
              );
              if (newAbstract.a) {
                updateAttributes(
                  childElement,
                  newAbstract.a
                );
              }
              if (newAbstract.c) {
                updateElementTree(
                  childElement,
                  newAbstract.c
                );
              }
              const insertAdjacentElement = (element2, elementAbstract2, position) => {
                if (position && (!elementAbstract2 || elementAbstract2.t)) {
                  element2.insertAdjacentElement(
                    position,
                    childElement
                  );
                } else {
                  element2.parentNode.insertBefore(
                    childElement,
                    element2
                  );
                }
              };
              if (newIndex === 0) {
                insertAdjacentElement(
                  element,
                  elementAbstract,
                  "afterbegin"
                );
              } else if ((oldChildAbstracts?.length ?? 0) + newCount > newIndex) {
                insertAdjacentElement(
                  element.childNodes[newIndex]
                  // (oldChildAbstracts as NodeContent[])[newIndex + newCount],
                  // 'beforebegin',
                );
              } else {
                insertAdjacentElement(
                  element,
                  elementAbstract,
                  "beforeend"
                );
              }
            } else {
              childElement = typeof newAbstract === "string" ? newAbstract : newAbstract.c;
              const insertAdjacentText = (element2, elementAbstract2, position) => {
                if (position && (!elementAbstract2 || elementAbstract2.t)) {
                  element2.insertAdjacentText(
                    position,
                    childElement
                  );
                } else {
                  element2.parentNode.insertBefore(
                    document.createTextNode(childElement),
                    element2.nextSibling
                  );
                }
              };
              if (newIndex === 0) {
                insertAdjacentText(
                  element,
                  elementAbstract,
                  "afterbegin"
                );
              } else if ((oldChildAbstracts?.length ?? 0) + newCount > newIndex) {
                insertAdjacentText(
                  element.childNodes[newIndex]
                  // (oldChildAbstracts as NodeContent[])[newIndex + newCount],
                  // 'beforebegin',
                );
              } else {
                insertAdjacentText(
                  element,
                  elementAbstract,
                  "beforeend"
                );
              }
            }
            newCount++;
          }
        }
      }
      const elementLength = (oldChildAbstracts?.length ?? 0) + newCount;
      if (elementLength >= newIndex) {
        for (let i = elementLength - 1; i >= newIndex; i--) {
          element.childNodes[i].remove();
        }
      }
    };
    if (typeof initialState === "string") {
      initialState = JSON.parse(initialState);
    }
    initialState ??= {};
    let proxyChanged = true;
    const triggerUpdate = () => {
      if (!proxyChanged) {
        proxyChanged = true;
        Promise.resolve().then(updateAbstracts);
      }
    };
    let state = Object.getPrototypeOf(initialState) === Proxy.prototype ? initialState : proxify(
      initialState,
      triggerUpdate
    );
    const _rootElement = typeof rootElement === "string" ? document.querySelector(rootElement) || document.body.appendChild(
      document.createElement("div")
    ) : rootElement;
    if (typeof oldAbstractTree === "string") {
      try {
        oldAbstractTree = JSON.parse(oldAbstractTree);
      } catch (error) {
        oldAbstractTree = void 0;
      }
    }
    oldAbstractTree ??= childrenToNodes(_rootElement);
    let active = true, updating = false;
    const updateAbstracts = () => {
      if (active && !updating && // Only update if changes to the state have been made.
      proxyChanged && // Don't update while handling listeners.
      listenerCount <= 0) {
        updating = true;
        proxyChanged = false;
        let newAbstractTree = arrayify(
          renderView(state)
        );
        updateElementTree(
          _rootElement,
          newAbstractTree,
          oldAbstractTree
        );
        oldAbstractTree = newAbstractTree;
        oldMemoList = newMemoList;
        newMemoList = [];
        updating = false;
        if (proxyChanged) {
          throw new Error("update during render");
        }
      }
    };
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

  // node_modules/@doars/vroagn/dst/vroagn.js
  var delay = async (time) => {
    if (time > 0) {
      return new Promise(
        (resolve) => setTimeout(resolve, time)
      );
    }
    return null;
  };
  var normalizeContentType = (contentType) => contentType.split(";")[0].trim().toLowerCase();
  var getFileExtension = (url) => {
    const match = url.match(/\.([^./?]+)(?:[?#]|$)/);
    return match ? match[1].toLowerCase() : null;
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
    initialOptions = {
      ...DEFAULT_VALUES,
      ...structuredClone(initialOptions)
    };
    let lastExecutionTime = 0;
    let activeRequests = 0;
    let totalRequests = 0;
    let debounceTimeout = null;
    const throttle = async (throttleValue) => {
      const now = Date.now();
      const waitTime = throttleValue - (now - lastExecutionTime);
      lastExecutionTime = now + (waitTime > 0 ? waitTime : 0);
      await delay(waitTime);
    };
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
    const sendRequest = async (options2) => {
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
      const executeFetch = async () => {
        const response2 = await (options2.fetch ?? fetch)(url, config);
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
                result2 = await parser.parser(
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
                result2 = await response2.arrayBuffer();
                break;
              case "blob":
                result2 = await response2.blob();
                break;
              case "formdata":
                result2 = await response2.formData();
                break;
              case "text/plain":
              case "text":
              case "txt":
                result2 = await response2.text();
                break;
              case "text/html-partial":
              case "html-partial":
                result2 = await response2.text();
                const template = document.createElement("template");
                template.innerHTML = result2;
                result2 = template.content.childNodes;
                break;
              case "text/html":
              case "html":
                result2 = await response2.text();
                result2 = new DOMParser().parseFromString(result2, "text/html");
                break;
              case "application/json":
              case "text/json":
              case "json":
                result2 = await response2.json();
                break;
              case "image/svg+xml":
              case "svg":
                result2 = await response2.text();
                result2 = new DOMParser().parseFromString(result2, "image/svg+xml");
                break;
              case "application/xml":
              case "text/xml":
              case "xml":
                result2 = await response2.text();
                result2 = new DOMParser().parseFromString(result2, "application/xml");
                break;
            }
          }
          return [null, response2, result2];
        } catch (error2) {
          return [error2 || new Error("Thrown parsing error is falsy"), response2, null];
        }
      };
      const retryRequest = async () => {
        let attempt = 0;
        const retryAttempts = options2.retryAttempts || 0;
        const retryDelay = options2.retryDelay || 0;
        while (attempt < retryAttempts) {
          const [error2, response2, result2] = await executeFetch();
          if (!error2) {
            return [error2, response2, result2];
          }
          if (!options2.retryCodes?.includes(response2.status || 200)) {
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
          await delay(delayTime);
        }
        return executeFetch();
      };
      const [error, response, result] = await retryRequest();
      if (!response.ok) {
        return [new Error(response.statusText), response, result];
      }
      return [error, response, result];
    };
    return async (sendOptions) => {
      const options2 = {
        ...initialOptions,
        ...structuredClone(sendOptions)
      };
      if (initialOptions.headers) {
        options2.headers = {
          ...initialOptions.headers,
          ...options2.headers
        };
      }
      if (options2.debounce) {
        await debounce(options2.debounce);
      }
      if (options2.delay) {
        await delay(options2.delay);
      }
      if (options2.throttle) {
        await throttle(options2.throttle);
      }
      if (options2.maxConcurrency && activeRequests >= options2.maxConcurrency) {
        await new Promise((resolve) => {
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
      const results = await sendRequest(
        options2
      );
      activeRequests--;
      return results;
    };
  };

  // src/utilities/clone.js
  var cloneRecursive = (value) => {
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        const clone = [];
        for (let i = 0; i < value.length; i++) {
          clone.push(cloneRecursive(value[i]));
        }
        value = clone;
      } else {
        const clone = {};
        for (const key in value) {
          clone[key] = cloneRecursive(value[key]);
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

  // src/apis/open-ai.js
  var _createMessage = createSingleton(
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
  var createMessage = (state, messages, context = null, instructions = null) => {
    const appRole = state.apiModel.toLowerCase().includes("o1") ? "developer" : "system";
    messages = cloneRecursive(messages);
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
    return _createMessage()({
      headers: {
        Authorization: "Bearer " + state.apiCredentials
      },
      body: {
        model: state.apiModel,
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
  var _getModels = createSingleton(
    () => create({
      domain: "https://api.openai.com",
      path: "/v1/models",
      headers: {
        "Accept": "application/json"
      }
    })
  );
  var getModels = (state) => _getModels()({
    headers: {
      Authorization: "Bearer " + state.apiCredentials
    }
  });

  // src/apis/anthropic.js
  var _createMessage2 = createSingleton(
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
  var createMessage2 = (state, messages, context = null, instructions = null) => {
    messages = cloneRecursive(messages);
    if (instructions) {
      messages.unshift({
        role: "user",
        content: instructions
      });
    }
    return _createMessage2()({
      headers: {
        "x-api-key": state.apiCredentials
      },
      body: {
        model: state.apiModel,
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
  var _getModels2 = createSingleton(
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
  var getModels2 = (state) => {
    return _getModels2()({
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

  // src/apis/apis.js
  var APIS = Object.freeze({
    open_ai: {
      code: "open_ai",
      name: "OpenAI",
      preferredModel: "gpt-4o-mini",
      requireCredentials: true,
      modelOptionsFilter: (model) => ![
        "babbage-",
        "dall-e-",
        "davinci-",
        "embedding-",
        "moderation-",
        "tts-",
        "whisper-"
      ].some((keyword) => model.id.toLowerCase().includes(keyword)) && !model.id.match(/-(?:\d){4,}-(?:\d){2,}-(?:\d){2,}$/) && !model.id.match(/-(?:\d){4,}$$/)
    },
    anthropic: {
      code: "anthropic",
      name: "Anthropic",
      preferredModel: "claude-3-5-haiku-20241022",
      preferredModelName: "Claude 3.5 Haiku",
      requireCredentials: true,
      modelOptionsFilter: (model) => ![
        "(old)"
      ].some((keyword) => model.name.toLowerCase().includes(keyword))
    }
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
  var createMessage3 = (state, messages, context = null, instructions = null) => callApi({
    [APIS.anthropic.code]: createMessage2,
    [APIS.open_ai.code]: createMessage
  }, state, messages, context, instructions);
  var getModels3 = (state) => callApi({
    [APIS.anthropic.code]: getModels2,
    [APIS.open_ai.code]: getModels
  }, state);

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
    statistics: "statistics",
    clarification: "clarification",
    comprehension: "comprehension",
    conversation: "conversation"
    // TODO: Fill in the blank would be fun, good to practise spelling and vocabulary. Give the user several options of what could fit. Bit bland and boring. The time it takes to answer is too low compared to the time it tames to generate the question.
  });

  // src/data/translations.js
  var translate = (state, key, locale = null) => {
    locale ??= state.sourceLocale;
    if (!(locale in TRANSLATIONS)) {
      console.warn('Er zijn geen vertalingen beschikbaar voor de taal "' + locale + '"');
      return key;
    }
    if (!(key in TRANSLATIONS[locale])) {
      console.warn('Er is geen vertaling beschikbaar voor de taal "' + locale + '" met de sleutel "' + key + '".');
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
        (match, key2) => {
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
          return match;
        }
      ).replace(
        /{%t:([^%]+)%}/g,
        (match, key2) => {
          if (key2 in TRANSLATIONS[locale]) {
            let value = TRANSLATIONS[locale][key2];
            if (value !== void 0 && value !== null) {
              if (Array.isArray(value)) {
                return value.join(" ");
              }
              return value.toString();
            }
          }
          return match;
        }
      );
    };
    return replace(TRANSLATIONS[locale][key]);
  };
  var TRANSLATIONS = Object.freeze({
    [LOCALES.dan]: {
      [LOCALES.dan]: "Dansk",
      [LOCALES.deu]: "Tysk",
      [LOCALES.eng]: "Engelsk (Storbritannien)",
      [LOCALES.epo]: "Esperanto",
      [LOCALES.fry]: "Frisisk (West)",
      [LOCALES.isl]: "Islandsk",
      [LOCALES.nld]: "Hollandsk",
      [LOCALES.nno]: "Norsk (nynorsk)",
      [LOCALES.nob]: "Norsk (bokm\xE5l)",
      [LOCALES.swe]: "Svensk",
      [LOCALES.vls]: "Flamsk",
      "proficiency_name-a1": "A1: Begynder",
      "proficiency_description-a1": [
        "L\xE6sning: Du kan forst\xE5 velkendte navne, ord og meget enkle s\xE6tninger, for eksempel p\xE5 skilte, plakater eller i kataloger.",
        "Skrivning: Du kan skrive et kort, enkelt postkort, for eksempel sende en feriehilsen. Du kan udfylde formularer med personlige oplysninger, for eksempel indtaste dit navn, nationalitet og adresse p\xE5 en hotelregistreringsformular."
      ],
      "proficiency_example-a1": '"Hej! Mit navn er Maria. Jeg bor i et lille hus i London med min familie. Jeg har en bror og en s\xF8ster. Jeg kan godt lide at spise \xE6bler og p\xE6rer. Hvad er din yndlingsfrugt?"',
      "proficiency_name-a2": "A2: Let \xF8vet",
      "proficiency_description-a2": [
        "L\xE6sning: Du kan l\xE6se meget korte, enkle tekster. Du kan finde specifikke, forudsigelige oplysninger i enkle hverdagstekster s\xE5som annoncer, brochurer, menuer og k\xF8replaner, og du kan forst\xE5 korte, simple personlige breve.",
        "Skrivning: Du kan skrive korte, enkle noter og beskeder om emner, der vedr\xF8rer umiddelbare behov. Du kan skrive et meget simpelt personligt brev, for eksempel takke nogen for noget."
      ],
      "proficiency_example-a2": '"Sidste weekend gik jeg i parken med mine venner. Vi havde en picnic med sandwiches og juice. Vejret var solrigt, og vi spillede fodbold. Derefter gik vi p\xE5 caf\xE9 og fik is. Det var en sjov dag!"',
      "proficiency_name-b1": "B1: Mellem",
      "proficiency_description-b1": [
        "L\xE6sning: Du kan forst\xE5 tekster, der hovedsageligt best\xE5r af hverdags- eller jobrelateret sprog med h\xF8j frekvens. Du kan forst\xE5 beskrivelser af begivenheder, f\xF8lelser og \xF8nsker i personlige breve.",
        "Skrivning: Du kan skrive enkle sammenh\xE6ngende tekster om emner, der er velkendte eller af personlig interesse. Du kan skrive personlige breve, der beskriver oplevelser og indtryk."
      ],
      "proficiency_example-b1": '"Jeg nyder at l\xE6se b\xF8ger, is\xE6r krimier. For nylig l\xE6ste jeg en historie om en detektiv, der l\xF8ste en vanskelig sag. Det var meget sp\xE6ndende, og jeg kunne ikke stoppe med at l\xE6se. Jeg kan godt lide krimier, fordi de f\xE5r mig til at t\xE6nke og pr\xF8ve at g\xE6tte slutningen."',
      "proficiency_name-b2": "B2: Over middel",
      "proficiency_description-b2": [
        "L\xE6sning: Du kan l\xE6se artikler og rapporter om aktuelle problemer, hvor skribenterne indtager bestemte holdninger eller synspunkter. Du kan forst\xE5 moderne litter\xE6r prosa.",
        "Skrivning: Du kan skrive klar, detaljeret tekst om en bred vifte af emner, der er relateret til dine interesser. Du kan skrive et essay eller en rapport, hvor du videregiver information eller giver grunde for eller imod et bestemt synspunkt. Du kan skrive breve, der fremh\xE6ver den personlige betydning af begivenheder og oplevelser."
      ],
      "proficiency_example-b2": '"Konceptet om fjernarbejde er blevet stadig mere popul\xE6rt i de seneste \xE5r. Det giver fleksibilitet og bekvemmelighed for medarbejdere, s\xE5 de kan arbejde hvor som helst fra. Dog medf\xF8rer det ogs\xE5 udfordringer som opretholdelse af produktivitet og kommunikation med kollegaer. Samlet set synes jeg, at fordelene opvejer ulemperne."',
      "proficiency_name-c1": "C1: Avanceret",
      "proficiency_description-c1": [
        "L\xE6sning: Du kan forst\xE5 lange og komplekse faktuelle og litter\xE6re tekster og v\xE6rds\xE6tte stilistiske forskelle. Du kan forst\xE5 specialiserede artikler og l\xE6ngere tekniske instruktioner, selv n\xE5r de ikke er relateret til dit fagomr\xE5de.",
        "Skrivning: Du kan udtrykke dig klart i velstruktureret tekst og uddybe synspunkter. Du kan skrive om komplekse emner i et brev, essay eller rapport og understrege de v\xE6sentligste punkter. Du kan v\xE6lge en stil, der passer til l\xE6seren."
      ],
      "proficiency_example-c1": '"Klima\xE6ndringer er et af de mest presserende problemer i vor tid. Selvom vedvarende energikilder som vind- og solenergi bliver stadig vigtigere, er overgangen v\xE6k fra fossile br\xE6ndstoffer stadig en stor udfordring. Regeringerne skal samarbejde med industrien og lokalsamfundene om at skabe b\xE6redygtige politikker, der balancerer \xF8konomisk v\xE6kst med milj\xF8beskyttelse."',
      "proficiency_name-c2": "C2: Kompetent",
      "proficiency_description-c2": [
        "L\xE6sning: Du kan uden besv\xE6r l\xE6se n\xE6sten alle former for skrevet sprog, inklusive abstrakte, strukturelt eller sprogligt komplekse tekster s\xE5som manualer, specialartikler og litter\xE6re v\xE6rker.",
        "Skrivning: Du kan skrive klar, flydende tekst i en passende stil. Du kan skrive komplekse breve, rapporter eller artikler, der pr\xE6senterer en sag med en effektiv logisk struktur, som hj\xE6lper modtageren med at bem\xE6rke og huske v\xE6sentlige punkter. Du kan skrive resum\xE9er og anmeldelser af professionelle eller litter\xE6re v\xE6rker."
      ],
      "proficiency_example-c2": '"Nuancerne i den sproglige udvikling afsl\xF8rer meget om kulturelle og samfundsm\xE6ssige skift over tid. For eksempel signalerer optagelsen af l\xE5neord ofte en periode med kulturel udveksling eller indflydelse. Analyse af s\xE5danne m\xF8nstre forbedrer ikke kun vores forst\xE5else af sprogudvikling, men giver ogs\xE5 dybe indsigter i historiske forhold mellem civilisationer. Dette dynamiske samspil understreger kompleksiteten og sammenh\xE6ngen i menneskelig kommunikation."',
      "prompt-context": 'Du er ekspert i og underviser i {%t:{%s:targetLocale%}%}. Brugeren studerer {%t:{%s:targetLocale%}%}. Brugeren behersker allerede sproget p\xE5 CEFR-niveau {%s:proficiencyLevel%}. Dette betyder, at brugeren allerede har f\xF8lgende f\xE6rdigheder: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". Dog \xF8nsker brugeren at forbedre sine f\xE6rdigheder yderligere.',
      "prompt-comprehension": "Lav en l\xE6se- og skrive\xF8velse, hvor brugeren modtager en tekst p\xE5 {%t:{%s:targetLocale%}%} sammen med et sp\xF8rgsm\xE5l p\xE5 {%t:{%s:sourceLocale%}%} om teksten, som brugeren skal besvare p\xE5 {%t:{%s:targetLocale%}%}. Giv ingen yderligere instruktioner, forklaringer eller svar til brugeren. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter.",
      "prompt-comprehension-follow_up": "Giv feedback p\xE5 den stillede l\xE6se- og skrive\xF8velse. Giv kort feedback p\xE5 {%t:{%s:targetLocale%}%} med en dybdeg\xE5ende analyse, der er klar nok til brugerens vidensniveau i {%t:{%s:targetLocale%}%}. Fokuser udelukkende p\xE5 sproglige aspekter og ignor\xE9r indholdsm\xE6ssige vurderinger eller fortolkninger af beskeden. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter.",
      "prompt-conversation": "Du vil simulere en samtale med brugeren p\xE5 {%t:{%s:targetLocale%}%}. Giv ikke yderligere instruktioner eller forklaringer til brugeren. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter. Skriv den f\xF8rste besked i samtalen og introducer straks et emne at diskutere.",
      "prompt-conversation-follow_up": "Du simulerer en samtale med brugeren p\xE5 {%t:{%s:targetLocale%}%}. Giv f\xF8rst kort, grundig feedback p\xE5 beskeden med fokus udelukkende p\xE5 sproglige aspekter, og ignor\xE9r indholdsm\xE6ssige vurderinger eller fortolkninger. Besvar derefter beskeden p\xE5 {%t:{%s:targetLocale%}%}. Giv ikke yderligere instruktioner eller forklaringer til brugeren. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter.",
      "prompt-clarification": "Brugeren har et sp\xF8rgsm\xE5l nedenfor, svar kortfattet med dybdeg\xE5ende feedback, passende til brugerens sprogniveau. Skriv altid i ren tekst uden formatering, etiketter eller overskrifter. Besvar ikke sp\xF8rgsm\xE5let, hvis det ikke er sprogligt relateret.",
      "prompt-topic": ' Inkorpor\xE9r f\xF8lgende emne i din besked "{%topic%}".',
      "greeting": "Hej!",
      "button-go_back": "Tilbage",
      "button-reset": "Nulstil",
      "button-generate": "Gener\xE9r",
      "button-answer": "Svar",
      "button-reply": "Svar",
      "button-ask": "Sp\xF8rg",
      "setup-source_language": "S\xE5, du vil forbedre dine f\xE6rdigheder i et sprog? Lad denne app hj\xE6lpe dig med at \xF8ve. Vi skal starte med at v\xE6lge et sprog, du allerede kender.",
      "setup-target_language": "Nu til n\xE6ste trin, hvilket sprog vil du gerne l\xE6re?",
      "setup-proficiency_leven": "Hvor god vil du sige, du allerede er i sproget? Se forklaringen nedenfor sammen med en eksempeltekst for at f\xE5 en id\xE9 om, hvilken slags tekster du kan forvente.",
      "setup-topics_of_interest": "Det er meget sjovere, hvis \xF8velserne nogle gange indeholder et emne, du finder interessant. Udfyld derfor et par emner nedenfor, som j\xE6vnligt kan dukke op. T\xE6nk is\xE6r p\xE5 hobbyer eller andre interesser. Jo flere, jo bedre!",
      "setup-api_code": 'Denne app bruger en "stor sprogmodel" til at generere og vurdere \xF8velser. Du har m\xE5ske h\xF8rt om det, alle i tech-sektoren taler om udviklingen inden for kunstig intelligens. Appen bruger en LLM, men leveres ikke med en, s\xE5 vi skal linke den til en LLM-udbyder. Hvilken udbyder vil du bruge?',
      "setup-api_credentials": "Nu er det vigtige sp\xF8rgsm\xE5l n\xF8glen. Du kan f\xE5 den fra udviklerens dashboard. Der st\xE5r sandsynligvis, at du ikke b\xF8r dele den med tredjeparter. Heldigvis sender denne app aldrig n\xF8glen videre. Stadig ikke overbevist? Tjek appens kildekode eller vent p\xE5 en version, der ikke l\xE6ngere kr\xE6ver dette.",
      "setup-test_api_credentials": "Test n\xF8gle",
      "setup-api_credentials_untested": "Test legitimationsoplysningerne, f\xF8r du forts\xE6tter.",
      "setup-api_credentials_tested": 'Den angivne n\xF8gle virker. Nu kan du v\xE6lge, hvilken "stor sprogmodel" du vil bruge. Ikke sikker p\xE5 forskellene? Intet problem, vi anbefaler at v\xE6lge "{%preferredModel%}". Det b\xF8r v\xE6re fint.',
      "setup-outro": "Held og lykke, og hav det sjovt!",
      "setup-next": "Begynd at \xF8ve",
      "overview-intro": "Hvad vil du gerne g\xF8re?",
      "overview-comprehension-title": "Besvar sp\xF8rgsm\xE5l om tekster",
      "overview-comprehension-description": "Du modtager en kort tekst p\xE5 {%t:{%s:targetLanguage%}%} sammen med et sp\xF8rgsm\xE5l, der skal besvares p\xE5 {%t:{%s:targetLanguage%}%}.",
      "overview-conversation-title": "\xD8v samtaler",
      "overview-conversation-description": "En kort samtale vil blive simuleret p\xE5 {%t:{%s:targetLanguage%}%}, for eksempel om at bestille mad eller diskutere en hobby.",
      "overview-clarification-title": "Bed om afklaring",
      "overview-clarification-description": "F\xE5 forklaringer om {%t:{%s:targetLanguage%}%}, s\xE5som en grammatisk regel som b\xF8jninger eller kasus.",
      "overview-statistics-title": "Se statistik",
      "overview-statistics-description": "Se antallet af aktiviteter, du har gennemf\xF8rt.",
      "overview-options-title": "Just\xE9r indstillinger",
      "overview-options-description": "Skift det sprog, du vil l\xE6re, de emner, du finder interessante, eller den anvendte LLM.",
      "options-source_language": "Hvilket sprog kender du allerede?",
      "options-target_language": "Hvilket sprog vil du gerne l\xE6re?",
      "options-proficiency_leven": "Hvor god er du til sproget? Se forklaringen nedenfor sammen med en eksempeltekst for at f\xE5 en id\xE9 om, hvilken slags tekster du kan forvente.",
      "options-topics_of_interest": "Udfyld et par emner nedenfor, som j\xE6vnligt kan dukke op i \xF8velserne.",
      "options-api_code": 'Denne app bruger en "stor sprogmodel" til at generere og vurdere \xF8velser. Hvilken udbyder vil du linke?',
      "options-api_credentials": "Indtast n\xF8glen fra udviklerens dashboard.",
      "options-test_api_credentials": "Test n\xF8gle",
      "options-api_credentials_untested": "Test legitimationsoplysningerne, f\xF8r du forts\xE6tter.",
      "options-api_credentials_tested": 'Den angivne n\xF8gle virker. V\xE6lg en "stor sprogmodel" at bruge, vi anbefaler "{%preferredModel%}".',
      "statistics-activity_per_category": "I alt har du besvaret {%s:statisticComprehensionActivity%} sp\xF8rgsm\xE5l om tekster, sendt {%s:statisticConversationActivity%} beskeder i \xF8velsessamtaler og stillet {%s:statisticClarificationActivity%} sp\xF8rgsm\xE5l.",
      "statistics-no_activity": "Desv\xE6rre har du endnu ikke gennemf\xF8rt nok aktiviteter til at blive vist her. G\xE5 til oversigten, og v\xE6lg en \xF8velse for at komme i gang. Din fremgang vil blive sporet i baggrunden.",
      "statistics-no_activity_streak": "Du har i \xF8jeblikket ingen igangv\xE6rende aktivitetsr\xE6kke. Du kan opbygge en ved at gennemf\xF8re mindst \xE9n \xF8velse p\xE5 flere p\xE5 hinanden f\xF8lgende dage.",
      "statistics-current_activity_streak": "Din nuv\xE6rende aktivitetsr\xE6kke er {%s:statisticCurrentActivityStreak%} dage lang.",
      "statistics-longest_activity_streak": "Din l\xE6ngste aktivitetsr\xE6kke nogensinde var {%s:statisticLongestActivityStreak%} dage lang.",
      "clarification-intro": "Hvad vil du gerne have mere information om?",
      "clarification-placeholder": "Jeg undrer mig over...",
      "comprehension-intro": "Du vil snart l\xE6se en tekst p\xE5 {%t:{%s:targetLanguage%}%} sammen med et sp\xF8rgsm\xE5l om den. Besvar sp\xF8rgsm\xE5let p\xE5 {%t:{%s:targetLanguage%}%}. Derefter vil du modtage noget feedback om dit svar.",
      "conversation-intro": "Du vil snart simulere en samtale p\xE5 {%t:{%s:targetLanguage%}%}, s\xE5 svar altid p\xE5 {%t:{%s:targetLanguage%}%}. Du kan modtage feedback undervejs."
    },
    [LOCALES.deu]: {
      [LOCALES.dan]: "D\xE4nisch",
      [LOCALES.deu]: "Deutsch",
      [LOCALES.eng]: "Englisch (Vereinigtes K\xF6nigreich)",
      [LOCALES.epo]: "Esperanto",
      [LOCALES.fry]: "Friesisch (West)",
      [LOCALES.isl]: "Isl\xE4ndisch",
      [LOCALES.nld]: "Niederl\xE4ndisch",
      [LOCALES.nno]: "Norwegisch (Nynorsk)",
      [LOCALES.nob]: "Norwegisch (Bokm\xE5l)",
      [LOCALES.swe]: "Schwedisch",
      [LOCALES.vls]: "Fl\xE4misch",
      "proficiency_name-a1": "A1: Anf\xE4nger",
      "proficiency_description-a1": [
        "Lesen: Sie k\xF6nnen vertraute Namen, W\xF6rter und sehr einfache S\xE4tze verstehen, zum Beispiel auf Schildern, Plakaten oder in Katalogen.",
        "Schreiben: Sie k\xF6nnen eine kurze, einfache Postkarte schreiben, zum Beispiel Urlaubsgr\xFC\xDFe verschicken. Sie k\xF6nnen Formulare mit pers\xF6nlichen Angaben ausf\xFCllen, z. B. Name, Staatsangeh\xF6rigkeit und Adresse in einem Hotelanmeldeformular eintragen."
      ],
      "proficiency_example-a1": '"Hallo! Mein Name ist Maria. Ich wohne mit meiner Familie in einem kleinen Haus in London. Ich habe einen Bruder und eine Schwester. Ich esse gerne \xC4pfel und Birnen. Was ist dein Lieblingsobst?"',
      "proficiency_name-a2": "A2: Grundlegende Kenntnisse",
      "proficiency_description-a2": [
        "Lesen: Sie k\xF6nnen sehr kurze, einfache Texte lesen. Sie k\xF6nnen spezifische, vorhersehbare Informationen in einfachen Alltagsmaterialien wie Anzeigen, Prospekten, Speisekarten und Fahrpl\xE4nen finden und kurze einfache pers\xF6nliche Briefe verstehen.",
        "Schreiben: Sie k\xF6nnen kurze, einfache Notizen und Mitteilungen zu unmittelbaren Bed\xFCrfnissen schreiben. Sie k\xF6nnen einen sehr einfachen pers\xF6nlichen Brief schreiben, zum Beispiel, um jemandem f\xFCr etwas zu danken."
      ],
      "proficiency_example-a2": '"Letztes Wochenende bin ich mit meinen Freunden in den Park gegangen. Wir hatten ein Picknick mit Sandwiches und Saft. Das Wetter war sonnig und wir haben Fu\xDFball gespielt. Danach sind wir in ein Caf\xE9 gegangen und haben Eis gegessen. Es war ein sch\xF6ner Tag!"',
      "proficiency_name-b1": "B1: Mittelstufe",
      "proficiency_description-b1": [
        "Lesen: Sie k\xF6nnen Texte verstehen, die haupts\xE4chlich aus h\xE4ufig gebrauchten Alltags- oder beruflichen Ausdr\xFCcken bestehen. Sie k\xF6nnen Beschreibungen von Ereignissen, Gef\xFChlen und W\xFCnschen in pers\xF6nlichen Briefen verstehen.",
        "Schreiben: Sie k\xF6nnen einfache, zusammenh\xE4ngende Texte zu vertrauten Themen oder Themen von pers\xF6nlichem Interesse schreiben. Sie k\xF6nnen pers\xF6nliche Briefe schreiben, in denen Erfahrungen und Eindr\xFCcke beschrieben werden."
      ],
      "proficiency_example-b1": '"Ich lese gerne B\xFCcher, besonders Krimis. K\xFCrzlich habe ich eine Geschichte \xFCber einen Detektiv gelesen, der einen schwierigen Fall gel\xF6st hat. Es war sehr spannend, und ich konnte nicht aufh\xF6ren zu lesen. Ich mag Krimis, weil sie mich zum Nachdenken bringen und ich das Ende erraten m\xF6chte."',
      "proficiency_name-b2": "B2: Fortgeschrittene Kenntnisse",
      "proficiency_description-b2": [
        "Lesen: Sie k\xF6nnen Artikel und Berichte lesen, die sich mit aktuellen Problemen befassen, bei denen die Verfasser bestimmte Haltungen oder Standpunkte einnehmen. Sie k\xF6nnen moderne literarische Texte verstehen.",
        "Schreiben: Sie k\xF6nnen klare, detaillierte Texte zu einer Vielzahl von Themen schreiben, die mit Ihren Interessen zusammenh\xE4ngen. Sie k\xF6nnen Aufs\xE4tze oder Berichte schreiben, in denen Sie Informationen weitergeben oder Gr\xFCnde f\xFCr oder gegen einen bestimmten Standpunkt darlegen. Sie k\xF6nnen Briefe schreiben, in denen die pers\xF6nliche Bedeutung von Ereignissen und Erfahrungen hervorgehoben wird."
      ],
      "proficiency_example-b2": '"Das Konzept des Remote-Arbeitens wird in den letzten Jahren immer beliebter. Es bietet Flexibilit\xE4t und Komfort f\xFCr Mitarbeiter, da sie von \xFCberall aus arbeiten k\xF6nnen. Allerdings gibt es auch Herausforderungen, wie zum Beispiel die Aufrechterhaltung der Produktivit\xE4t und der Kommunikation mit Kollegen. Insgesamt denke ich, dass die Vorteile die Nachteile \xFCberwiegen."',
      "proficiency_name-c1": "C1: Fortgeschritten",
      "proficiency_description-c1": [
        "Lesen: Sie k\xF6nnen lange und komplexe Sach- und literarische Texte verstehen und Stilunterschiede w\xFCrdigen. Sie k\xF6nnen spezialisierte Artikel und l\xE4ngere technische Anweisungen verstehen, selbst wenn sie nicht in Ihrem Fachgebiet liegen.",
        "Schreiben: Sie k\xF6nnen sich in klaren, gut strukturierten Texten ausdr\xFCcken und Standpunkte ausf\xFChrlich darlegen. Sie k\xF6nnen \xFCber komplexe Themen in einem Brief, Aufsatz oder Bericht schreiben und dabei hervorheben, was Sie f\xFCr besonders wichtig halten. Sie k\xF6nnen den Stil an die Zielgruppe anpassen."
      ],
      "proficiency_example-c1": '"Der Klimawandel ist eines der dr\xE4ngendsten Probleme unserer Zeit. W\xE4hrend erneuerbare Energiequellen wie Wind- und Solarenergie an Bedeutung gewinnen, bleibt der \xDCbergang weg von fossilen Brennstoffen eine gro\xDFe Herausforderung. Regierungen m\xFCssen mit Industrien und Gemeinschaften zusammenarbeiten, um nachhaltige Richtlinien zu schaffen, die wirtschaftliches Wachstum mit Umweltschutz in Einklang bringen."',
      "proficiency_name-c2": "C2: Kompetente Sprachverwendung",
      "proficiency_description-c2": [
        "Lesen: Sie k\xF6nnen nahezu alle Formen der geschriebenen Sprache m\xFChelos lesen, einschlie\xDFlich abstrakter, strukturell oder sprachlich komplexer Texte wie Handb\xFCcher, spezialisierte Artikel und literarische Werke.",
        "Schreiben: Sie k\xF6nnen klar und fl\xFCssig schreiben und dabei einen Stil verwenden, der dem jeweiligen Kontext entspricht. Sie k\xF6nnen komplexe Briefe, Berichte oder Artikel verfassen, die einen Sachverhalt effektiv darstellen und eine logische Struktur aufweisen, die dem Leser hilft, wichtige Punkte zu erkennen und sich zu merken. Sie k\xF6nnen Zusammenfassungen und Rezensionen professioneller oder literarischer Werke schreiben."
      ],
      "proficiency_example-c2": '"Die Nuancen der sprachlichen Evolution offenbaren viel \xFCber kulturelle und gesellschaftliche Ver\xE4nderungen im Laufe der Zeit. Beispielsweise signalisiert die \xDCbernahme von Lehnw\xF6rtern oft eine Phase kulturellen Austauschs oder Einflusses. Die Analyse solcher Muster erweitert nicht nur unser Verst\xE4ndnis der Sprachentwicklung, sondern bietet auch tiefgehende Einblicke in historische Beziehungen zwischen Zivilisationen. Dieses dynamische Zusammenspiel unterstreicht die Komplexit\xE4t und Vernetzung menschlicher Kommunikation."',
      "prompt-context": 'Sie sind ein Experte in und Lehrer f\xFCr {%t:{%s:targetLocale%}%}. Der Benutzer lernt {%t:{%s:targetLocale%}%}. Der Benutzer beherrscht die Sprache bereits auf dem GER-Niveau {%s:proficiencyLevel%}. Das bedeutet, dass der Benutzer bereits \xFCber die folgenden F\xE4higkeiten verf\xFCgt: "{%t:proficiency_description-{%s:proficiencyLevel%}%}". Allerdings m\xF6chte der Benutzer seine Sprachkenntnisse weiter verbessern.',
      "prompt-comprehension": "Erstelle eine Lese- und Schreib\xFCbung, bei der der Benutzer einen Text in {%t:{%s:targetLocale%}%} erh\xE4lt, zusammen mit einer Frage in {%t:{%s:sourceLocale%}%} \xFCber den Text, auf die der Benutzer in {%t:{%s:targetLocale%}%} antworten muss. Gib dem Benutzer keine weiteren Anweisungen, Erkl\xE4rungen oder Antworten. Schreibe immer im Klartext, ohne jegliche Formatierung, Beschriftungen oder \xDCberschriften.",
      "prompt-comprehension-follow_up": "Gib Feedback zur gestellten Lese- und Schreib\xFCbung. Gib kurzes Feedback zum {%t:{%s:targetLocale%}%} mit einer detaillierten Analyse, die dem Kenntnisstand des Benutzers im {%t:{%s:targetLocale%}%} angemessen ist. Konzentriere dich ausschlie\xDFlich auf sprachliche Aspekte und ignoriere inhaltliche Bewertungen oder Interpretationen der Nachricht. Schreibe immer im Klartext, ohne jegliche Formatierung, Beschriftungen oder \xDCberschriften.",
      "prompt-conversation": "Sie werden eine Konversation mit dem Benutzer in {%t:{%s:targetLocale%}%} simulieren. Geben Sie dem Benutzer keine weiteren Anweisungen oder Erkl\xE4rungen. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder \xDCberschriften. Schreiben Sie die erste Nachricht der Konversation, indem Sie sofort ein Gespr\xE4chsthema einf\xFChren.",
      "prompt-conversation-follow_up": "Sie simulieren eine Konversation mit dem Benutzer in {%t:{%s:targetLocale%}%}. Geben Sie zuerst ein kurzes, tiefgehendes Feedback zur Nachricht und konzentrieren Sie sich dabei ausschlie\xDFlich auf sprachliche Aspekte, ohne inhaltliche Bewertungen oder Interpretationen vorzunehmen. Antworten Sie anschlie\xDFend auf die Nachricht in {%t:{%s:targetLocale%}%}. Geben Sie keine weiteren Anweisungen oder Erkl\xE4rungen. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder \xDCberschriften.",
      "prompt-clarification": "Der Benutzer hat eine Frage unten gestellt, beantworten Sie diese pr\xE4zise mit einem tiefgehenden Feedback, das der Sprachkompetenz des Benutzers entspricht. Schreiben Sie immer im Klartext ohne Formatierungen, Labels oder \xDCberschriften. Beantworten Sie die Frage nicht, wenn sie nicht sprachbezogen ist.",
      "prompt-topic": ' Integrieren Sie das folgende Thema in Ihre Nachricht: "{%topic%}".',
      "greeting": "Hallo!",
      "button-go_back": "Zur\xFCck",
      "button-reset": "Zur\xFCcksetzen",
      "button-generate": "Generieren",
      "button-answer": "Antworten",
      "button-reply": "Antworten",
      "button-ask": "Fragen",
      "setup-source_language": "Sie m\xF6chten also Ihre Sprachkenntnisse verbessern? Lassen Sie diese App Ihnen beim \xDCben helfen. Wir m\xFCssen zun\xE4chst eine Sprache ausw\xE4hlen, die Sie bereits beherrschen.",
      "setup-target_language": "Nun der n\xE4chste Schritt: Welche Sprache m\xF6chten Sie lernen?",
      "setup-proficiency_leven": "Wie gut sch\xE4tzen Sie Ihre Kenntnisse in der Sprache ein? Siehe die Erkl\xE4rung unten zusammen mit einem Beispieltext, um eine Vorstellung davon zu bekommen, welche Art von Texten Sie erwarten k\xF6nnen.",
      "setup-topics_of_interest": "Es macht viel mehr Spa\xDF, wenn die \xDCbungen manchmal ein Thema behandeln, das Sie interessant finden. F\xFCllen Sie daher unten einige Themen ein, die regelm\xE4\xDFig vorkommen k\xF6nnen. Denken Sie vor allem an Hobbys oder andere Interessen. Je mehr, desto besser!",
      "setup-api_code": 'Diese App verwendet ein "Large Language Model", um \xDCbungen zu generieren und zu bewerten. Vielleicht haben Sie schon davon geh\xF6rt, jeder in der Tech-Branche spricht \xFCber die Entwicklungen in der k\xFCnstlichen Intelligenz. Die App nutzt ein LLM, bringt jedoch keines mit, daher m\xFCssen wir es mit einem LLM-Anbieter verkn\xFCpfen. Welchen Anbieter m\xF6chten Sie verwenden?',
      "setup-api_credentials": "Nun die wichtige Frage: der Schl\xFCssel. Sie k\xF6nnen ihn im Entwickler-Dashboard erhalten. Dort steht wahrscheinlich, dass Sie ihn nicht mit Dritten teilen sollen. Zum Gl\xFCck sendet diese App den Schl\xFCssel niemals weiter. Immer noch nicht \xFCberzeugt? Schauen Sie sich den Quellcode der App an oder warten Sie auf eine Version, die diesen nicht mehr ben\xF6tigt.",
      "setup-test_api_credentials": "Schl\xFCssel testen",
      "setup-api_credentials_untested": "Testen Sie die Zugangsdaten, bevor Sie fortfahren.",
      "setup-api_credentials_tested": 'Der angegebene Schl\xFCssel funktioniert. Jetzt k\xF6nnen Sie ausw\xE4hlen, welches "Large Language Model" Sie verwenden m\xF6chten. Nicht sicher, welche Unterschiede es gibt? Kein Problem, wir empfehlen Ihnen die Auswahl von "{%preferredModel%}". Das sollte passen.',
      "setup-outro": "Viel Erfolg und viel Spa\xDF!",
      "setup-next": "Mit dem \xDCben beginnen",
      "overview-intro": "Was m\xF6chten Sie tun?",
      "overview-comprehension-title": "Fragen zu Texten beantworten",
      "overview-comprehension-description": "Sie erhalten einen kurzen Text in {%t:{%s:targetLanguage%}%} zusammen mit einer Frage, die in {%t:{%s:targetLanguage%}%} beantwortet werden soll.",
      "overview-conversation-title": "Konversationen \xFCben",
      "overview-conversation-description": "Es wird eine kurze Konversation in {%t:{%s:targetLanguage%}%} simuliert, beispielsweise \xFCber das Bestellen von Essen oder das Diskutieren eines Hobbys.",
      "overview-clarification-title": "Erkl\xE4rung anfordern",
      "overview-clarification-description": "Erhalten Sie Erkl\xE4rungen zu {%t:{%s:targetLanguage%}%}, z. B. zu einer Grammatikregel wie Konjugationen oder F\xE4llen.",
      "overview-statistics-title": "Statistiken ansehen",
      "overview-statistics-description": "Werfen Sie einen Blick auf die Anzahl der abgeschlossenen Aktivit\xE4ten.",
      "overview-options-title": "Optionen anpassen",
      "overview-options-description": "\xC4ndern Sie die Sprache, die Sie lernen m\xF6chten, die Themen, die Sie interessieren, oder das verwendete LLM.",
      "options-source_language": "Welche Sprache beherrschen Sie bereits?",
      "options-target_language": "Welche Sprache m\xF6chten Sie lernen?",
      "options-proficiency_leven": "Wie gut sind Sie in der Sprache? Siehe die Erkl\xE4rung unten zusammen mit einem Beispieltext, um eine Vorstellung davon zu bekommen, welche Art von Texten Sie erwarten k\xF6nnen.",
      "options-topics_of_interest": "F\xFCllen Sie unten einige Themen ein, die regelm\xE4\xDFig in den \xDCbungen vorkommen k\xF6nnen.",
      "options-api_code": 'Diese App verwendet ein "Large Language Model", um \xDCbungen zu generieren und zu bewerten. Welchen Anbieter m\xF6chten Sie verkn\xFCpfen?',
      "options-api_credentials": "Geben Sie den Schl\xFCssel aus dem Entwickler-Dashboard ein.",
      "options-test_api_credentials": "Schl\xFCssel testen",
      "options-api_credentials_untested": "Testen Sie die Zugangsdaten, bevor Sie fortfahren.",
      "options-api_credentials_tested": 'Der angegebene Schl\xFCssel funktioniert. W\xE4hlen Sie ein "Large Language Model", das Sie verwenden m\xF6chten. Wir empfehlen "{%preferredModel%}".',
      "statistics-activity_per_category": "Insgesamt haben Sie {%s:statisticComprehensionActivity%} Fragen zu Texten beantwortet, {%s:statisticConversationActivity%} Nachrichten in \xDCbungsgespr\xE4chen gesendet und {%s:statisticClarificationActivity%} Fragen gestellt.",
      "statistics-no_activity": "Leider haben Sie noch nicht gen\xFCgend Aktivit\xE4ten abgeschlossen, um hier angezeigt zu werden. Gehen Sie zur \xDCbersicht und w\xE4hlen Sie eine \xDCbung, um zu beginnen. Ihr Fortschritt wird im Hintergrund verfolgt.",
      "statistics-no_activity_streak": "Sie haben derzeit keine laufende Aktivit\xE4tsserie. Sie k\xF6nnen eine aufbauen, indem Sie an mehreren aufeinanderfolgenden Tagen mindestens eine \xDCbung abschlie\xDFen.",
      "statistics-current_activity_streak": "Ihre aktuelle Aktivit\xE4tsserie betr\xE4gt {%s:statisticCurrentActivityStreak%} Tage.",
      "statistics-longest_activity_streak": "Ihre l\xE4ngste Aktivit\xE4tsserie war jemals {%s:statisticLongestActivityStreak%} Tage lang.",
      "clarification-intro": "Wozu m\xF6chten Sie mehr Informationen?",
      "clarification-placeholder": "Ich frage mich...",
      "comprehension-intro": "Sie werden gleich einen Text in {%t:{%s:targetLanguage%}%} lesen, zusammen mit einer Frage dazu. Beantworten Sie die Frage in {%t:{%s:targetLanguage%}%}. Anschlie\xDFend erhalten Sie ein Feedback zu Ihrer Antwort.",
      "conversation-intro": "Sie werden gleich eine Konversation in {%t:{%s:targetLanguage%}%} simulieren. Antworten Sie stets in {%t:{%s:targetLanguage%}%}. M\xF6glicherweise erhalten Sie zwischendurch Feedback."
    },
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
      "prompt-comprehension-follow_up": "Provide feedback on the reading and writing exercise given. Offer concise feedback on the {%t:{%s:targetLocale%}%} with in-depth analysis that is clear enough for the user's level of knowledge. Write the feedback in {%t:{%s:targetLocale%}%}. Focus exclusively on linguistic aspects and ignore content-related evaluations or interpretations of the message. Always write in plain text without any formatting, labels, or headings.",
      "prompt-conversation": "You will simulate a conversation with the user in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings. Write the first message in the conversation, immediately introducing a topic to discuss.",
      "prompt-conversation-follow_up": "You are simulating a conversation with the user in {%t:{%s:targetLocale%}%}. First, provide brief, in-depth feedback on the message, focusing solely on linguistic aspects and ignoring any content-related evaluations or interpretations. Then, respond to the message in {%t:{%s:targetLocale%}%}. Do not provide any further instructions or explanations to the user. Always write in plain text without any formatting, labels, or headings.",
      "prompt-clarification": "The user has a question below, answer it concisely with in-depth feedback, appropriate to the user's proficiency level. Answer the question {%t:{%s:sourceLocale%}%} and provide examples in {%t:{%s:targetLocale%}%} where appropriate. Always write in plain text without any formatting, labels, or headings. Do not answer the question if it is not language-related.",
      "prompt-topic": ' Incorporate the following topic into your message "{%topic%}".',
      "greeting": "Hi!",
      "button-go_back": "Go back",
      "button-reset": "Reset",
      "button-generate": "Generate",
      "button-answer": "Answer",
      "button-reply": "Reply",
      "button-ask": "Ask",
      "setup-source_language": "So, you want to improve your proficiency in a language? Let this app help you practise. We need to start by choosing a language you already know.",
      "setup-target_language": "Now the next step, which language would you like to learn?",
      "setup-proficiency_leven": "How proficient would you say you already are in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.",
      "setup-topics_of_interest": "It's much more enjoyable if the exercises sometimes feature a topic you find interesting. Therefore, fill in a few topics below that can regularly appear. Think mainly of any hobbies or other interests. The more, the better!",
      "setup-api_code": `This app uses a "Large Language Model" to generate and assess exercises. You may have heard about it, everyone in the tech sector keeps talking about developments in artificial intelligence. The app uses an LLM, but doesn't come with one, so we need to link it to an LLM provider. Which provider would you like to use?`,
      "setup-api_credentials": "Now, the important question is the key. You can get it from the developer's dashboard. It probably states that you shouldn't share it with third parties. Fortunately, this app never sends the key elsewhere. Still not convinced? Check out the app's source code or wait for a version that no longer requires this.",
      "setup-test_api_credentials": "Test key",
      "setup-api_credentials_untested": "Test the credentials before proceeding.",
      "setup-api_credentials_tested": 'The provided key works. Now you can choose which "Large Language Model" to use. Not sure what the differences are? No problem, we recommend selecting "{%preferredModel%}". That should be fine.',
      "setup-outro": "Good luck and have fun!",
      "setup-next": "Start practising",
      "overview-intro": "What would you like to do?",
      "overview-comprehension-title": "Answer questions about texts",
      "overview-comprehension-description": "You'll receive a short text in {%t:{%s:targetLanguage%}%} along with a question to be answered in {%t:{%s:targetLanguage%}%}.",
      "overview-conversation-title": "Practise conversations",
      "overview-conversation-description": "A short conversation will be simulated in {%t:{%s:targetLanguage%}%}, for example, about ordering food or discussing a hobby.",
      "overview-clarification-title": "Ask for clarification",
      "overview-clarification-description": "Get explanations about {%t:{%s:targetLanguage%}%}, such as a grammar rule like conjugations or cases.",
      "overview-statistics-title": "View statistics",
      "overview-statistics-description": "Take a look at the number of activities you have completed.",
      "overview-options-title": "Adjust options",
      "overview-options-description": "Change the language you want to learn, the topics you find interesting, or the LLM used.",
      "options-source_language": "Which language do you already know?",
      "options-target_language": "Which language would you like to learn?",
      "options-proficiency_leven": "How proficient are you in the language? See the explanation below along with an example text to get an idea of what kind of texts to expect.",
      "options-topics_of_interest": "Fill in a few topics below that can regularly appear in the exercises.",
      "options-api_code": 'This app uses a "Large Language Model" to generate and assess exercises. Which provider would you like to link?',
      "options-api_credentials": "Enter the key from the developer's dashboard.",
      "options-test_api_credentials": "Test key",
      "options-api_credentials_untested": "Test the credentials before proceeding.",
      "options-api_credentials_tested": 'The provided key works. Choose a "Large Language Model" to use, we recommend "{%preferredModel%}".',
      "statistics-activity_per_category": "In total, you have answered {%s:statisticComprehensionActivity%} questions about texts, sent {%s:statisticConversationActivity%} messages in practice conversations, and asked {%s:statisticClarificationActivity%} questions.",
      "statistics-no_activity": "Unfortunately, you haven't completed enough activities yet to display here. Go to the overview and choose an exercise to start. Your progress will be tracked in the background.",
      "statistics-no_activity_streak": "You currently have no ongoing activity streak. You can build one by completing at least one exercise on multiple consecutive days.",
      "statistics-current_activity_streak": "Your current activity streak is {%s:statisticCurrentActivityStreak%} days long.",
      "statistics-longest_activity_streak": "Your longest activity streak ever was {%s:statisticLongestActivityStreak%} days long.",
      "clarification-intro": "What would you like more information about?",
      "clarification-placeholder": "I wondering...",
      "comprehension-intro": "You will soon read a text in {%t:{%s:targetLanguage%}%} along with a question about it. Answer the question in {%t:{%s:targetLanguage%}%}. You will then receive some feedback regarding your answer.",
      "conversation-intro": "You will soon simulate a conversation in {%t:{%s:targetLanguage%}%}, so always respond in {%t:{%s:targetLanguage%}%}. You may receive feedback along the way."
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
      "prompt-comprehension-follow_up": "Geef feedback op de lees en schrijfvaardigheidsoefening die gesteld is. Geef beknopt feedback over het {%t:{%s:targetLocale%}%} met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Schrijf de feedback in het {%t:{%s:targetLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-conversation": "Je gaat met de gebruiker een gesprek simuleren in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Schrijf het eerste bericht in een gesprek dat al gelijk een onderwerp introduceert om het over te hebben.",
      "prompt-conversation-follow_up": "Je bent met de gebruiker een gesprek aan het simuleren in het {%t:{%s:targetLocale%}%}. Geef als antwoord op een bericht eerst beknopt feedback met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker in het {%t:{%s:sourceLocale%}%}. Richt je hierbij uitsluitend op taalkundige aspecten en negeer inhoudelijke evaluaties of interpretaties van het bericht. Ga daarna verder met het antwoorden op het bericht in het {%t:{%s:targetLocale%}%}. Geef geen verdere instructies of uitleg aan de gebruiker. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten.",
      "prompt-clarification": "De gebruiker heeft onderstaande vraag, beantwoord de vraag beknopt met veel diepgang dat duidelijk genoeg is voor het kennis niveau van de gebruiker. Beantwoord de vraag in het {%t:{%s:sourceLocale%}%} geef voorbeelden in het {%t:{%s:targetLocale%}%} waar nodig. Schrijf altijd in platte tekst zonder enige opmaak, labels of kopteksten. Beantwoord de vraag niet als het absoluut niet taal gerelateerd is.",
      "prompt-topic": ' Verwerk het volgende onderwerp in jouw bericht "{%topic%}".',
      "greeting": "Hoi!",
      "button-go_back": "Ga terug",
      "button-reset": "Resetten",
      "button-generate": "Genereren",
      "button-answer": "Antwoorden",
      "button-reply": "Antwoorden",
      "button-ask": "Vragen",
      "setup-source_language": "Dus jij wilt een taal beter beheersen? Laat deze app je helpen met oefenen. We moeten beginnen met een taal te kiezen die je al kent.",
      "setup-target_language": "Nu het volgende probleem, welke taal wil je leren?",
      "setup-proficiency_leven": "Hoe goed zou jij zeggen dat je al in de taal bent? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.",
      "setup-topics_of_interest": "Het is natuurlijk veel leuker als er af en toe een onderwerp voorbij komt wat je interessant vind. Vul daarom hieronder een aantal onderwerpen in die regelmatig terug kunnen komen. Denk hierbij vooral aan enige hobbies of andere interesses. Des te meer des te beter!",
      "setup-api_code": 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model". Je hebt er vast wel van gehoord, iedereen in de technologie sector houdt maar niet op over de ontwikkelingen in kunstmatige intelligentie. De app maakt dus gebruik van een LLM om de oefening te maken en te beoordelen. Helaas komt de app niet zelf met een eentje, dus moeten we een koppeling maken met een LLM. Met welke aanbieder wil je een koppeling maken?',
      "setup-api_credentials": "Nu is de grote vraag nog de sleutel. Deze kun je bij het ontwikkelaars paneel. Er staat waarschijnlijk al bij vermeld dat je deze niet met derden moet delen. Gelukkig stuurt deze app nooit de sleutel door. Vertrouw je het toch niet? Bekijk dan de brondcode van deze app, of wacht wellicht tot er een variant gemaakt is waarbij dat niet meer nodig is.",
      "setup-test_api_credentials": "Sleutel testen",
      "setup-api_credentials_untested": "Test de gegevens eerst voordat je verder gaat.",
      "setup-api_credentials_tested": 'De opgegeven sleutel werkt, nu kan je nog kiezen uit welke "Large Language Model" je wilt gebruiken. Heb je geen idee wat de verschillen zijn? Geen probleem, we raden aan dat je "{%preferredModel%}" selecteert, daarmee komt het vast wel goed.',
      "setup-outro": "Heel veel succes en plezier!",
      "setup-next": "Begin met oefenen",
      "overview-intro": "Wat wil je gaan doen?",
      "overview-comprehension-title": "Vragen over teksten beantwoorden",
      "overview-comprehension-description": "Je krijgt een korte tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag die kan beantwoorden in natuurlijk het {%t:{%s:targetLanguage%}%}.",
      "overview-conversation-title": "Gesprekken oefenen",
      "overview-conversation-description": "Er zal een kort gesprekje gespeeld worden in het {%t:{%s:targetLanguage%}%} over bijvoorbeeld het bestellen van eten of over een hobby.",
      "overview-clarification-title": "Uitleg vragen",
      "overview-clarification-description": "Krijg verduidelijk over het {%t:{%s:targetLanguage%}%}, bijvoorbeeld een grammatica regel zoals vervoegingen en naamvallen.",
      "overview-statistics-title": "Statistieken inzien",
      "overview-statistics-description": "Neem een kijkje in het aantal activiteiten dat je gedaan hebt.",
      "overview-options-title": "Opties aanpassen",
      "overview-options-description": "Pas aan welke taal je wilt leren, welke onderwerpen je interessant vind of welke LLM gebruikt wordt.",
      "options-source_language": "Welke taal ken je al?",
      "options-target_language": "Welke taal wil je leren?",
      "options-proficiency_leven": "Hoe vaardig ben je al in de taal? Zie de uitleg hieronder samen met een voorbeeld tekst om een idee te geven wat voor teksten je kan verwachten.",
      "options-topics_of_interest": "Vul hieronder een aantal onderwerpen in die regelmatig terug kunnen komen in de oefening.",
      "options-api_code": 'Om te oefenen wordt gebruik gemaakt van een "Large Language Model" om de oefening te maken en te beoordelen. Met welke aanbieder wil je een koppeling maken?',
      "options-api_credentials": "Voer de sleutel uit het ontwikkelaars paneel in.",
      "options-test_api_credentials": "Sleutel testen",
      "options-api_credentials_untested": "Test de gegevens eerst voordat je verder gaat.",
      "options-api_credentials_tested": 'De opgegeven sleutel werkt. Kies een "Large Language Model" dat je wilt gebruiken, wij raden "{%preferredModel%}" aan.',
      "statistics-activity_per_category": " In totaal heb je {%s:statisticComprehensionActivity%} vragen over teksten beantwoord, {%s:statisticConversationActivity%} berichten verstuurd in oefen gesprekken, en {%s:statisticClarificationActivity%} vragen gesteld.",
      "statistics-no_activity": "Je hebt helaas nog niet genoeg activiteiten gedaan om hier weer te geven. Ga naar het overzicht en kies een oefening om te beginnen, op de achtergrond zal bijgehouden worden hoeveel je er al voltooid hebt.",
      "statistics-no_activity_streak": "Je hebt op dit momenten geen lopende activiteitenreeks opgebouwd. Deze krijg je door op meerdere dagen op een rij minimaal \xE9\xE9n oefening te doen.",
      "statistics-current_activity_streak": "Op dit moment is jouw activiteitenreeks {%s:statisticCurrentActivityStreak%} dagen lang.",
      "statistics-longest_activity_streak": " Jouw langste activiteitenreeks ooit was {%s:statisticLongestActivityStreak%} dagen lang.",
      "clarification-intro": "Waar wil je meer over weten?",
      "clarification-placeholder": "Ik vraag mij af...",
      "comprehension-intro": "Je leest straks een tekst in het {%t:{%s:targetLanguage%}%} samen met een vraag erover, beantwoord de vraag in het {%t:{%s:targetLanguage%}%}. Vervolgens zal je enige verbeterpunten krijgen over jouw antwoord.",
      "conversation-intro": "Je gaat straks een gesprek simuleren in het {%t:{%s:targetLanguage%}%} zorg daarom dat je ook altijd in het {%t:{%s:targetLanguage%}%} antwoord. Tussendoor zal je enige verbeterpunten kunnen ontvangen."
    }
  });
  var TRANSLATABLE_CODES = Object.keys(TRANSLATIONS);

  // src/screens/setup.js
  var isReady = (state) => {
    return state.apiCode && APIS[state.apiCode] && (!APIS[state.apiCode].requireCredentials || state.apiCredentialsTested) && (state.apiModel ?? APIS[state.apiCode].preferredModel);
  };
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
    }, translate(state, "setup-proficiency_leven")),
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
    ...APIS[state.apiCode].requireCredentials ? [
      node("label", {
        for: "input-api_credentials"
      }, translate(state, "setup-api_credentials")),
      node("textarea", {
        id: "input-api_credentials",
        change: (event) => {
          state.apiCredentials = event.target.value;
        },
        value: state.apiCredentials
      })
    ] : [],
    node("button", {
      click: () => {
        state.apiCredentialsPending = true;
        getModels3(state).then(([error, response, result]) => {
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
      translate(state, "setup-test_api_credentials"),
      node("span", {
        class: state.apiCredentialsPending ? "pending" : ""
      })
    ]),
    ...state.apiCredentialsError ? [node("p", state.apiCredentialsError)] : [],
    ...!state.apiCredentialsTested ? [node("p", translate(state, "setup-api_credentials_untested"))] : [
      node("label", {
        for: "select_api_model"
      }, translate(state, "setup-api_credentials_tested").replace("{%preferredModel%}", APIS[state.apiCode].preferredModelName ?? APIS[state.apiCode].preferredModel)),
      node(
        "select",
        {
          id: "select_api_model",
          change: (event) => {
            if (state.apiModel !== event.target.selectedOptions[0].value) {
              state.apiModel = event.target.selectedOptions[0].value;
            }
          }
        },
        state.apiModels.data.filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true)).sort((a, b) => a.id.localeCompare(b.id)).map((model) => node("option", {
          selected: (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id ? "selected" : false,
          value: model.id
        }, model.name ?? model.id))
      )
    ],
    ...isReady(state) ? [node("p", translate(state, "setup-outro"))] : [],
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

  // src/screens/overview.js
  var overview = (state) => [
    node("p", [
      node("b", translate(state, "greeting")),
      node("br"),
      translate(state, "overview-intro")
    ]),
    node("button", {
      class: "card",
      click: () => {
        state.screen = SCREENS.comprehension;
      },
      type: "button"
    }, [
      node("b", translate(state, "overview-comprehension-title")),
      node("br"),
      translate(state, "overview-comprehension-description")
    ]),
    node("button", {
      class: "card",
      click: () => {
        state.screen = SCREENS.conversation;
      },
      type: "button"
    }, [
      node("b", translate(state, "overview-conversation-title")),
      node("br"),
      translate(state, "overview-conversation-description")
    ]),
    node("button", {
      class: "card",
      click: () => {
        state.screen = SCREENS.clarification;
      },
      type: "button"
    }, [
      node("b", translate(state, "overview-clarification-title")),
      node("br"),
      translate(state, "overview-clarification-description")
    ]),
    node("button", {
      class: "card",
      click: () => {
        state.screen = SCREENS.statistics;
      },
      type: "button"
    }, [
      node("b", translate(state, "overview-statistics-title")),
      node("br"),
      translate(state, "overview-statistics-description")
    ]),
    node("button", {
      class: "card",
      click: () => {
        state.screen = SCREENS.options;
      },
      type: "button"
    }, [
      node("b", translate(state, "overview-options-title")),
      node("br"),
      translate(state, "overview-options-description")
    ])
  ];

  // src/utilities/streak.js
  var ONE_HOUR = 60 * 60 * 1e3;
  var ONE_DAY = ONE_HOUR * 24;
  var TWO_DAYS = ONE_DAY * 2;
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
    if (deltaTime > ONE_DAY) {
      state.statisticCurrentActivityStreak++;
      state.statisticLastActivityOn = today.toISOString();
    } else if (deltaTime > TWO_DAYS) {
      state.statisticCurrentActivityStreak = 1;
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
          class: "message-" + message.role
        }, message.content.split("\n").flatMap(
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
              createMessage3(
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
                if (result.content.endsWith("STOP")) {
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
              createMessage3(
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
          class: "message-" + message.role
        }, message.content.split("\n").flatMap(
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
            createMessage3(
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
          class: "message-" + message.role
        }, message.content.split("\n").flatMap(
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
              createMessage3(
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
              createMessage3(
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

  // src/screens/options.js
  var isReady2 = (state) => {
    return state.apiCode && APIS[state.apiCode] && (!APIS[state.apiCode].requireCredentials || state.apiCredentialsTested) && (state.apiModel ?? APIS[state.apiCode].preferredModel);
  };
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
    }, translate(state, "options-proficiency_leven")),
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
    ...APIS[state.apiCode].requireCredentials ? [
      node("label", {
        for: "input-api_credentials"
      }, translate(state, "options-api_credentials")),
      node("textarea", {
        id: "input-api_credentials",
        change: (event) => {
          state.apiCredentials = event.target.value;
        },
        value: state.apiCredentials
      })
    ] : [],
    node("button", {
      click: () => {
        state.apiCredentialsPending = true;
        getModels3(state).then(([error, response, result]) => {
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
    ...state.apiCredentialsError ? [node("p", state.apiCredentialsError)] : [],
    ...!state.apiCredentialsTested ? [node("p", translate(state, "options-api_credentials_untested"))] : [
      node("label", {
        for: "select_api_model"
      }, translate(state, "options-api_credentials_tested").replace("{%preferredModel%}", APIS[state.apiCode].preferredModelName ?? APIS[state.apiCode].preferredModel)),
      node(
        "select",
        {
          id: "select_api_model",
          change: (event) => {
            if (state.apiModel !== event.target.selectedOptions[0].value) {
              state.apiModel = event.target.selectedOptions[0].value;
            }
          }
        },
        state.apiModels.data.filter(APIS[state.apiCode].modelOptionsFilter ?? (() => true)).sort((a, b) => a.id.localeCompare(b.id)).map((model) => node("option", {
          selected: (state.apiModel ?? APIS[state.apiCode].preferredModel) === model.id ? "selected" : false,
          value: model.id
        }, model.name ?? model.id))
      )
    ],
    node("button", {
      click: () => {
        if (isReady2(state)) {
          state.screen = SCREENS.overview;
        }
      },
      disabled: !isReady2(state),
      type: "button"
    }, translate(state, "button-go_back"))
  ];

  // src/screens/statistics.js
  var statistics = (state) => [
    node("p", [
      node("b", translate(state, "greeting"))
    ]),
    ...conditional(
      state.statisticComprehensionActivity > 1 || state.statisticConversationActivity > 1 || state.statisticClarificationActivity > 1,
      node("p", translate(state, "statistics-activity_per_category")),
      node("p", translate(state, "statistics-no_activity"))
    ),
    node(
      "p",
      conditional(
        state.statisticCurrentActivityStreak > 1 && new Date(state.statisticLastActivityOn).toISOString().slice(0, 10) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
        [
          translate(state, "statistics-current_activity_streak"),
          ...conditional(
            state.statisticLongestActivityStreak > state.statisticCurrentActivityStreak,
            translate(state, "statistics-longest_activity_streak")
          )
        ],
        [
          translate(state, "statistics-no_activity_streak"),
          ...conditional(
            state.statisticLongestActivityStreak > 1,
            translate(state, "statistics-longest_activity_streak")
          )
        ]
      )
    ),
    node("button", {
      click: () => {
        state.screen = SCREENS.overview;
      },
      type: "button"
    }, translate(state, "button-go_back"))
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
      let screen = null;
      switch (state.screen) {
        default:
        case SCREENS.setup:
          screen = setup(state);
          break;
        case SCREENS.overview:
          screen = overview(state);
          break;
        case SCREENS.options:
          screen = options(state);
          break;
        case SCREENS.statistics:
          screen = statistics(state);
          break;
        case SCREENS.clarification:
          screen = clarification(state);
          break;
        case SCREENS.comprehension:
          screen = comprehension(state);
          break;
        case SCREENS.conversation:
          screen = conversation(state);
          break;
      }
      return node("div", {
        class: "screen"
      }, screen);
    },
    Object.assign({
      screen: SCREENS.setup,
      userIdentifier: createIdentifier(),
      sourceLocale: preferredLocale,
      sourceLanguage: getLanguageFromLocale(preferredLocale),
      targetLocale: LOCALES.en_gb,
      targetLanguage: getLanguageFromLocale(LOCALES.en_gb),
      proficiencyLevel: PROFICIENCY_LEVELS.a1,
      topicsOfInterest: [],
      apiCode: APIS.open_ai.code,
      apiModel: null,
      apiCredentials: null,
      apiCredentialsError: false,
      apiCredentialsTested: false,
      apiCredentialsPending: false,
      statisticComprehensionActivity: 0,
      statisticConversationActivity: 0,
      statisticClarificationActivity: 0,
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
      conversationMessages: []
    }, localStorage.getItem(STATE_KEY) ? JSON.parse(localStorage.getItem(STATE_KEY)) : {})
  );
})();
//# sourceMappingURL=app.js.map
