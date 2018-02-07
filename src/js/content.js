//用于将inject.js注入到页面中
$(document).ready(
    function () {
        setTimeout(function () {
            injectCustomJs("js/inject.js");
            injectCustomJs("js/customInject.js");
        }, 3000);
    }
)



function injectCustomJs(jsPath)
{
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    //console.log(temp);

    (document.head||document.documentElement).appendChild(temp);
}