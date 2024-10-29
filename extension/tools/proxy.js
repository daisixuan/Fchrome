
dtavm = {}
dtavm.proxy_start = function proxy_start() {
    dtavm = {}
    rawlog = console.log
    dtavm.log = rawlog
    delete rawlog
        // 保护伪造函数toString
        ; (() => {
            const $toString = Function.toString
            const myFunction_toString_symbol = Symbol('('.concat('', ')_', (Math.random()) + '').toString(36))
            const myToString = function () {
                return typeof this === 'function' && this[myFunction_toString_symbol] || $toString.call(this)
            }
            function set_native(func, key, value) {
                Object.defineProperty(func, key, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: value
                })
            }
            delete Function.prototype.toString
            set_native(Function.prototype, "toString", myToString)
            set_native(Function.prototype.toString, myFunction_toString_symbol, "function toString() { [native code] }")
            globalThis.dtavm.func_set_native = (func, name) => {
                //todo 系统函数没名字 native code
                set_native(func, myFunction_toString_symbol, `function ${func.name || name || ''}() { [native code] }`)
            }
        }).call(this);
    for (let key in Object.getOwnPropertyDescriptors(console)) {
        if (typeof console[key] == "function") {
            console[key] = function () { }
            dtavm.func_set_native(console[key], key)
        }
    }
    dtavm.proxy = function (obj, objname, type) {
        function getMethodHandler(WatchName, target_obj) {
            let methodhandler = {
                apply(target, thisArg, argArray) {
                    if (this.target_obj){
                        thisArg = this.target_obj
                    }
                    let result = Reflect.apply(target, thisArg, argArray)
                    if (target.name !== "toString"){
                        if (WatchName === "window.console"){
                        }
                        else if(!target.name){}
                        else if(result instanceof Promise){
                            result.then((data)=>{
                                dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is `, argArray,`result is `, data);
                            })
                        }else {
                            dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is `, argArray, `result is `, result);
                        }
                    }else{
                        dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is `, argArray, `result is `, result);
                    }
                    return result
                },
                construct(target, argArray, newTarget) {
                    var result = Reflect.construct(target, argArray, newTarget)
                    dtavm.log(`[${WatchName}] construct function name is [${target.name}], argArray is `, argArray, `result is `, result);
                    return result;
                }
            }
            methodhandler.target_obj = target_obj
            return methodhandler
        }

        function getObjhandler(WatchName) {
            let handler = {
                get(target, propKey, receiver) {
                    let result = target[propKey]
                    if (result instanceof Object) {
                        if (typeof result === "function") {
                            dtavm.log(`[${WatchName}] getting propKey is [`,propKey,`] , it is function`)
                            return new Proxy(result, getMethodHandler(WatchName, target))
                        }
                        else {
                            dtavm.log(`[${WatchName}] getting propKey is [`,propKey,`], result is [`,result,`]`);
                        }
                        return new Proxy(result, getObjhandler(`${WatchName}.${propKey}`))
                    }
                    if (typeof (propKey) !== "symbol") {
                        dtavm.log(`[${WatchName}] getting propKey is [`,propKey,`], result is [`,result,`]`);
                    }
                    return result;
                },
                set(target, propKey, value, receiver) {
                    if (value instanceof Object) {
                        dtavm.log(`[${WatchName}] setting propKey is [`,propKey,`], value is [`,value,`]`);
                    } else {
                        dtavm.log(`[${WatchName}] setting propKey is [`,propKey,`], value is [`,value,`]`);
                    }
                    try{
                        var result =  Reflect.set(target, propKey, value, receiver);
                        return result;
                    }catch(e){
                        target[propKey] = value;
                        return value;
                    }
                },
                has(target, propKey) {
                    var result = Reflect.has(target, propKey);
                    dtavm.log(`[${WatchName}] has propKey [`,propKey,`], result is [`,result,`]`)
                    return result;
                },
                deleteProperty(target, propKey) {
                    var result = Reflect.deleteProperty(target, propKey);
                    dtavm.log(`[${WatchName}] delete propKey [`,propKey,`], result is [`,result,`]`)
                    return result;
                },
                defineProperty(target, propKey, attributes) {
                    var result = Reflect.defineProperty(target, propKey, attributes);
                    dtavm.log(`[${WatchName}] defineProperty propKey [`,propKey,`] attributes is [`,attributes,`], result is [`,result,`]`)
                    return result
                },
                getPrototypeOf(target) {
                    var result = Reflect.getPrototypeOf(target)
                    dtavm.log(`[${WatchName}] getPrototypeOf result is [`,result,`]`)
                    return result;
                },
                setPrototypeOf(target, proto) {
                    dtavm.log(`[${WatchName}] setPrototypeOf proto is [`,proto,`]`)
                    return Reflect.setPrototypeOf(target, proto);
                },
                ownKeys(target) {
                    var result = Reflect.ownKeys(target)
                    dtavm.log(`[${WatchName}] invoke ownkeys; result is `, result)
                    return result
                },
                // preventExtensions(target) {
                //     dtavm.log(`[${WatchName}] preventExtensions`)
                //     return Reflect.preventExtensions(target);
                // },
                // isExtensible(target) {
                //     var result = Reflect.isExtensible(target)
                //     dtavm.log(`[${WatchName}] isExtensible, result is [`,result,`]`)
                //     return result;
                // },
            }
            return handler;
        }

        if (type === "method") {
            return new Proxy(obj, getMethodHandler(objname, obj));
        }
        return new Proxy(obj, getObjhandler(objname));
    }

    globalThis = dtavm.proxy(window_jyl, "globalThis")
    Object.defineProperties(globalThis, {
        'window': {
            configurable: false,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(window_jyl, "window")
            },
            set: undefined
        },
        'self': {
            configurable: false,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(window_jyl, "self")
            },
            set: undefined
        },
        'document': {
            configurable: false,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(document_jyl, "document")
            },
            set: undefined
        },
        'navigator': {
            configurable: true,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(navigator_jyl, "navigator")
            },
            set: undefined
        },
        'history': {
            configurable: true,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(history_jyl, "history")
            },
            set: undefined
        },
        'sessionStorage': {
            configurable: true,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(sessionStorage_jyl, "sessionStorage")
            },
            set: undefined
        },
        'localStorage': {
            configurable: true,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(localStorage_jyl, "localStorage")
            },
            set: undefined
        },
        'location': {
            configurable: false,
            enumerable: true,
            get: function get() {
                return dtavm.proxy(location_jyl, "location")
            },
            set: undefined
        },
    })

    screen = dtavm.proxy(screen_jyl, "screen")
    performance = dtavm.proxy(performance_jyl, "performance")
}
dtavm.iframe_proxy_start = function iframe_proxy_start() {
    function defineProperty(obj, key, value, configurable, enumerable, writable, getter, setter) {
        let attr = {
            configurable: configurable,
            enumerable: enumerable
        }
        if (value !== undefined) {
            attr["value"] = value
        }
        if (writable !== undefined) {
            attr["writable"] = writable
        }
        if (getter) {
            attr["get"] = getter
        }
        if (setter) {
            attr["set"] = setter
        }

        Object.defineProperty(obj, key, attr)
    }
    dtavm.raw_contentWindow_get = Object.getOwnPropertyDescriptors(HTMLIFrameElement.prototype)["contentWindow"].get
    dtavm.raw_contentDocument_get = Object.getOwnPropertyDescriptors(HTMLIFrameElement.prototype)["contentDocument"].get


    defineProperty(HTMLIFrameElement.prototype, "contentWindow", undefined, true, true, undefined, function(){
        var result = dtavm.raw_contentWindow_get.call(this);
        dtavm.log(`[HTMLIFrameElement.prototype] getting propKey is [contentWindow], value is`, result);
        if (result){
            return dtavm.proxy(result, "contentWindow");
        }else{
            return result;
        }
    }, undefined)
    defineProperty(HTMLIFrameElement.prototype, "contentDocument", undefined, true, true, undefined, function(){
        var result = dtavm.raw_contentDocument_get.call(this);
        dtavm.log(`[HTMLIFrameElement.prototype] getting propKey is [contentDocument], value is`, result);
        if (result){
            return dtavm.proxy(result, "contentDocument");    
        }else{
            return result;
        }
        
    }, undefined)
}
dtavm.function_proxy = function function_proxy(){
    let filter_func_list = ["function_proxy", "iframe_proxy_start", "proxy_start", "Function", "eval", "Object", "Array", "Number", "parseFloat", "parseInt", "Boolean", "String", "Symbol", "Date", "Promise", "RegExp", "Error", "AggregateError", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "ArrayBuffer", "Uint8Array", "Int8Array", "Uint16Array", "Int16Array", "Uint32Array", "Int32Array", "Float32Array", "Float64Array", "Uint8ClampedArray", "BigUint64Array", "BigInt64Array", "DataView", "Map", "BigInt", "Set", "WeakMap", "WeakSet", "Proxy", "FinalizationRegistry", "WeakRef", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape", "isFinite", "isNaN", "SharedArrayBuffer", "VMError", "Buffer"];
    const globalFunctions = Reflect.ownKeys(globalThis).filter((key) => {
        var result = globalThis[key];
        if (typeof result === 'function' && !filter_func_list.includes(key)) {
            eval(`${key}=window.${key}`)
            return key;
        }
    });
    dtavm.log("hook 全局函数列表", globalFunctions)
        
}