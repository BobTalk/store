/*
 *解析路径参数
 * return obj
 * */
function format(url) {
    var str = "";
    var obj = {};
    /*var url = window.location.href;*/
    try {
        var arr = url.split("?");
        var params = arr[1].split("&");
        var obj1 = {};
        for (var i = 0; i < params.length; i++) {
            var param = params[i].split("=");
            obj[param[0]] = param[1];
        }
    } catch (e) {
    }
    return obj;
}
/*
 * ajax的封装
 * */
function $ajax(options) {
    var _default = {
        url: null,
        data: null,
        method: 'get',
        dataType: "json",
        async: "true",
        cache: true,
        success: null,
        error: null
    }
    for (var key in options) {
        if (key === 'type') {
            _default.method = options['type'];
        }
        _default[key] = options[key];
    }
    var xhr = new XMLHttpRequest;
    var result = null;
    xhr.open(_default.method, _default.url, _default.async);
    xhr.onreadystatechange = function () {
        if (/^(2|3)\d{2}$/.test(xhr.status)) {
            if (xhr.readyState == 4) {
                result = xhr.responseText;
                switch (_default.dataType.toUpperCase()) {
                    case "JSON":
                        result = "JSON" in window ? JSON.parse(result) : eval(result);
                        break;
                    case "XML":
                        result = xhr.responseXML;
                        break;
                }
                _default.success && _default.success.call(xhr, result);
            }
            _default.error && _default.error.call(xhr, result);
        }
        return result;
    }
    xhr.send(_default.data);
}
/*写cookies*/
function setCookie(name, value) {
    var Days = 30;
     var exp = new Date();
     exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";path=/";
}
/*读取cookies*/
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    console.log(document.cookie.match(reg));
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    else {
        return null;
    }
}
/*删除cookies */
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}