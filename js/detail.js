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

/*获取数据*/
(function () {
    $ajax({
        url: '../data/detailDate.json',
        dateType: 'JSON',
        success: function (result) {
            voluation(result)
        }
    })
})()

/*商品数据*/
function voluation(result) {
    var navContent = document.getElementById('navContent');
    var introduce = document.getElementById("introduce");
    var route = document.getElementById('route');
    var goodsName = document.getElementById('goodsName');
    var money = document.getElementById('money');
    var img = document.getElementById('img');
    var select = document.getElementById('select');
    var medium = document.getElementById('medium');
    var seal = document.getElementById('seal');
    var url = window.location.href;
    var urlObj = format(url);
    var str = "",
        str1 = "";
    for (var key in result) {
        if (urlObj.goodsId == key) {
            (function () {
                route.innerHTML = '<a href="index.html">首页</a>' +
                    '<a href="javascript:void(0)">&gt;</a>' +
                    '<a href="list.html?Id=' + result[key].oneId + '">' + result[key].oneName + '</a> ' +
                    '<a href="javascript:void(0)">&gt;</a>' +
                    '<a href="list.html?subId=' + result[key].twoId + '">' + result[key].twoName + '</a>' +
                    '<a href="javascript:void(0)">&gt;</a>' +
                    '<a href="javascript:void(0)" class="blur">' + result[key].name + '</a>';
                goodsName.innerText = result[key].name;
                money.innerText = result[key].price;
                img.src = result[key].pUrl;
            })();
            for (var index in result[key].serviceTerm) {
                select.innerHTML += '<li>' + result[key].serviceTerm[index] + '</li>'
            }
            for (var pic in result[key].servicePro) {
                if (pic == 'sUrl') {
                    medium.src = result[key].servicePro[pic]
                } else if (pic == 'profile') {
                    seal.innerHTML = '<p style="text-indent: 2em;">' + result[key].servicePro[pic] + '</p>'
                }
            }
            for (var i = 0, len = result[key].introduce.length; i < len; i++) {
                if (result[key].introduce[i].type == 'text') {
                    introduce.innerHTML += '<div class="service clear"><div class="service-content"> ' + result[key].introduce[i].content + '</div></div>'
                }
                if (result[key].introduce[i].type == 'text_table') {
                    console.log(result[key].introduce[i]);
                    str += '<div class="performance clear">' +
                        '<div class="performance-box">' +
                        '<div class="basis">' +
                        '<p class="basis-name">' + result[key].introduce[i].head_name + '</p>' +
                        '<div class="basis-summary">';
                    for (var jj = 0; jj < result[key].introduce[i].content_group.length; jj++) {
                        var obj = result[key].introduce[i].content_group;
                        if (obj[jj]['text_style'] == '1') {
                            str += '<h6>' + obj[jj].text_content + '</h6>';
                        }
                        if (obj[jj]['text_style'] == '2') {
                            str += '<p style="text-indent: 2em;line-height: .2rem;">' + obj[jj].text_content + '</p>'
                        }
                    }
                    str += '</div></div></div></div>';

                }
                introduce.innerHTML = str;
                if (result[key].introduce[i].type == 'picture') {
                    introduce.innerHTML += '<div class="service clear"><div style="padding: .1rem;text-indent:0;" class="service-content"><img style="width: 100%;height: 100%;" src="' + result[key].introduce[i].content + '" alt=""></div></div>'
                }
                if (result[key].introduce[i].type == 'text_title') {
                    introduce.innerHTML += '<div class="performance clear">' +
                        '<div class="introduce-name">' +
                        '<span>' + result[key].introduce[i].content + '</span>' +
                        '<span style="position:absolute;width:7.82rem;top: 50%;right:0;border-bottom: 1px solid #1cacdc;margin-left: .15rem;"></span> ' +
                        '</div></div>';
                }
            }
        }
    }
}

/*下拉框*/
var term = {
    flag: true,
    selectFn: function () {
        var sel = document.getElementById('select');
        if (term.flag) {
            sel.parentNode.style.cssText = 'display:inline-block;'
        } else {
            sel.parentNode.style.cssText = 'display:none;'
        }
        term.flag = !term.flag
    },
    selectVal: function (event) {
        event = event.target || window.event.srcElement;
        var content = document.getElementById('content');
        content.innerText = event.textContent;
    }
}
var area = {
    flag: true,
    PlaceFn: function () {
        var sel = document.getElementById('place-item');
        if (area.flag) {
            sel.parentNode.style.cssText = 'display:inline-block;'
        } else {
            sel.parentNode.style.cssText = 'display:none;'
        }
        area.flag = !area.flag
    },
    select: function (event) {
        event = event.target || window.event.srcElement;
        var content = document.getElementById('placeVal');
        if (event.nodeName.toLowerCase() == "li") {
            content.innerText = event.textContent;
        }
    }
}


function goodsNum(event) {
    event = event.target || window.event.srcElement;
    var sum = document.getElementById('sum');
    if (event.value == '-') {
        if (sum.value == '1')return;
        sum.value--;
    } else if (event.value == '+') {
        sum.value++;
    }
}
/*手风琴*/
function accordion() {
    var navBar = document.getElementById('navBar');
    var navContent = document.getElementById('navContent');
    var navList = navBar.getElementsByTagName('a');
    var navContentObj = navContent.getElementsByTagName('li');
    for (var i = 0, len = navList.length; i < len; i++) {
        navList[i].index = i;
        navList[i].onclick = function () {
            for (var i = 0, len = navList.length; i < len; i++) {
                navList[i].className = '';
                navContentObj[i].className = ''
            }
            this.className = 'active';
            navContentObj[this.index].className = 'drop'
        }
    }
}