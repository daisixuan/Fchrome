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
dtavm = typeof dtavm == "undefined" ? {} : dtavm
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

var iframe = document.createElement('iframe');
//
var iframeDocument = iframe.contentDocument;
var iframeWindow = iframe.contentWindow;
document.body.appendChild(iframe)

iframeDocument = iframe.contentDocument;
iframeWindow = iframe.contentWindow;