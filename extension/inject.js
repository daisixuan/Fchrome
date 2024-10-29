console.log("inject proxy start!")

function inject_script(code){
    var script = document.createElement("script");
    script.innerHTML = code;
    script.onload = script.onreadystatechange = function(){
      script.onreadystatechange = script.onload = null;
    }
    var html = document.getElementsByTagName("html")[0];
    html.appendChild( script );
    html.removeChild( script );
  }

var hookers = ["config-proxy-hook", "config-iframe-proxy-hook", "config-function-proxy-hook"]
chrome.storage.local.get(hookers, function (result) {
    if (result["config-proxy-hook"]){
        console.log("启动代理器替换全局对象!")
        inject_script(dtavm.proxy_start.toString() + "\nproxy_start()")
        if (result["config-iframe-proxy-hook"]){
          console.log("启动iframe代理器!")
          inject_script(dtavm.iframe_proxy_start.toString() + "\iframe_proxy_start()")
        }
        if (result["config-function-proxy-hook"]){
          console.log("启动function代理器!")
          inject_script(dtavm.function_proxy.toString() + "\nfunction_proxy()")
        }
    }else{
        console.log("不启动代理器替换全局对象!")
    }
})