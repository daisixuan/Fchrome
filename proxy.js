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
                if (this.target_obj) {
                    thisArg = this.target_obj
                }
                let result = Reflect.apply(target, thisArg, argArray)
                if (target.name !== "toString") {
                    if (WatchName === "window.console") {
                    } else if (result instanceof Promise) {
                        result.then((data) => {
                            dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is `, argArray, `result is `, data);
                        })
                    } else {
                        dtavm.log(`[${WatchName}] apply function name is [${target.name}], argArray is `, argArray, `result is `, result);
                    }
                } else {
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
                        dtavm.log(`[${WatchName}] getting propKey is [`, propKey, `] , it is function`)
                        return new Proxy(result, getMethodHandler(WatchName, target))
                    }
                    else {
                        dtavm.log(`[${WatchName}] getting propKey is [`, propKey, `], result is [`, result, `]`);
                    }
                    return new Proxy(result, getObjhandler(`${WatchName}.${propKey}`))
                }
                if (typeof (propKey) !== "symbol") {
                    dtavm.log(`[${WatchName}] getting propKey is [`, propKey, `], result is [`, result, `]`);
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
                    // target[propKey] = value;
                    // return value;
                }
            },
            has(target, propKey) {
                var result = Reflect.has(target, propKey);
                dtavm.log(`[${WatchName}] has propKey [`, propKey, `], result is [`, result, `]`)
                return result;
            },
            deleteProperty(target, propKey) {
                var result = Reflect.deleteProperty(target, propKey);
                dtavm.log(`[${WatchName}] delete propKey [`, propKey, `], result is [`, result, `]`)
                return result;
            },
            defineProperty(target, propKey, attributes) {
                var result = Reflect.defineProperty(target, propKey, attributes);
                dtavm.log(`[${WatchName}] defineProperty propKey [`, propKey, `] attributes is [`, attributes, `], result is [`, result, `]`)
                return result
            },
            getPrototypeOf(target) {
                var result = Reflect.getPrototypeOf(target)
                dtavm.log(`[${WatchName}] getPrototypeOf result is [`, result, `]`)
                return result;
            },
            setPrototypeOf(target, proto) {
                dtavm.log(`[${WatchName}] setPrototypeOf proto is [`, proto, `]`)
                return Reflect.setPrototypeOf(target, proto);
            },
            // preventExtensions(target) {
            //     dtavm.log(`[${WatchName}] preventExtensions`)
            //     return Reflect.preventExtensions(target);
            // },
            // isExtensible(target) {
            //     var result = Reflect.isExtensible(target)
            //     dtavm.log(`[${WatchName}] isExtensible, result is [`, result, `]`)
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


Object.defineProperties(globalThis, {
    'window': {
        configurable: false,
        enumerable: true,
        get: function get() {
            return dtavm.proxy(window_jyl, "window")
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