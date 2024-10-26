function defineProperty(obj, key, value, configurable, enumerable, writable, getter, setter){
    let attr = {
        configurable: configurable,
        enumerable: enumerable
    }
    if(value !== undefined){
        attr["value"] = value
    }
    if(writable !==undefined){
        attr["writable"] = writable
    }
    if (getter){
        attr["get"] = getter
    }
    if (setter){
        attr["set"] = setter
    }

    Object.defineProperty(obj, key, attr)
}
defineProperty(HTMLIFrameElement.prototype, "contentWindow", undefined, true, true, undefined, function(){return window;}, undefined)
defineProperty(HTMLIFrameElement.prototype, "contentDocument", undefined, true, true, undefined, function(){return document;}, undefined)

var iframe = document.createElement('iframe');
document.body.appendChild(iframe)
var iframeDocument = iframe.contentDocument;
var iframeWindow = iframe.contentWindow;