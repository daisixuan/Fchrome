function sub_logger(){
  chrome.storage.local.get([
    'config-proxy-hook',
    ], function(e){
    chrome.browserAction.setBadgeBackgroundColor({color: '#BC1717'});
    var info = ''
    if (e['config-proxy-hook']){
      info += 'P'
    }
    if (e['config-function-proxy-hook']){
      info += 'F'
    }
    if (e['config-iframe-proxy-hook']){
      info += 'I'
    }
    chrome.browserAction.setBadgeText({text: info});
  })
}
document.querySelectorAll("input").forEach(function(v){
  chrome.storage.local.get([v.dataset.key], function (result) {
    if (v.type == 'checkbox'){
      v.checked = result[v.dataset.key];
    }
    if (v.type == 'text'){
      v.value = result[v.dataset.key] || '';
    }
  })
  v.addEventListener("change", function (e) {
    if (v.type == 'checkbox'){
      console.log(e.target.dataset.key, e.target.checked)
      chrome.storage.local.set({
        [e.target.dataset.key]: e.target.checked
      })
      sub_logger()
    }
  })
})






