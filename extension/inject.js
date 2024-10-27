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

var hookers = ["config-proxy-hook"]
chrome.storage.local.get(hookers, function (result) {
    if (result["config-proxy-hook"]){
        console.log("启动代理器替换全局对象!")
        let code = dtavm.proxy_start.toString() + "\nproxy_start()";
        inject_script(code)
    }else{
        console.log("不启动代理器替换全局对象!")
    }
})