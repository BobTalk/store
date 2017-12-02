/*
 *解析路径参数
 * return obj
 * */

function format(url) {
    var str = "";
    var obj = {};
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
        url: '../data/listDate.json',
        dateType: 'JSON',
        success: function (result) {
            voluation(result);

        }
    })
})();

function voluation(data) {
    var listImg = document.getElementById('listImg');
    var dateAll = document.getElementsByClassName("date");
    var navBar = document.getElementById('navBar');
    var barcon = document.getElementById('barcon');
    var nav = document.getElementById('nav');
    var objA = nav.getElementsByTagName('a');
    var objLi = navBar.getElementsByTagName('li');
    var url = window.location.href;
    var urlObj = format(url);
    var arry = [];
    var str = "";
    var str1 = "";
    for (var key in data) {
        if (urlObj.subId == key || urlObj.Id == key) {
            for (var k = 0, len = objLi.length; k < len; k++) {
                if (objLi[k].innerText.replace(/(^\s*)|(\s*$)/g, "") == data[key].name.replace(/(^\s*)|(\s*$)/g, "")) {
                    objLi[k].style.cssText = "background:#1cacde;"
                    objLi[k].getElementsByTagName('a')[0].style.cssText = 'color:#fff;'
                }

                objLi[k].onmouseover = function (event) {
                    console.log(event.target.childNodes[1]);
                    if (event.target.nodeName.toLowerCase() == "li") {
                        if (event.target.style.background.length != 0) {
                            event.target.style.background = 'rgb(28, 172, 222)';
                            event.target.childNodes[1].style.color = "rgb(255,255,255) !important"
                        }
                    } else if (event.target.nodeName.toLowerCase() == "a") {

                    }

                }

            }

            for (var j = 0, len = objA.length; j < len; j++) {
                if (objA[j].innerText == data[key].name) {
                    objA[j].style.cssText = "color:#1b4c98;"
                }
            }
            for (var i = 0, len = data[key].childs.length; i < len; i += 3) {
                arry.push(data[key].childs.slice(i, i + 3));
            }
            for (var q = 0; q < arry.length; q++) {
                str += "<div class='date'>"
                for (var z = 0; z < arry[q].length; z++) {
                    str += ' <li class="detail-list-info clear">' +
                        '<div class="detail-list-info-logo fl"> ' +
                        '<img src="' + arry[q][z]['url'] + '">' +
                        '</div>' +
                        '<div class="detail-list-info-content fl">' +
                        '<p class="detail-list-info-name">' + arry[q][z]['name'] + '</p> ' +
                        '<p class="detail-list-info-summary">' + arry[q][z]['content'] + '</p> ' +
                        '<div class="clear"> ' +
                        '<p class="inv fl">' +
                        '<span class="name">已出售:</span>' +
                        '<span class="num">0</span>' +
                        '</p>' +
                        '<p class="inv fl">' +
                        '<span class="name">用户满意度:</span>' +
                        '<span class="num">0</span>' +
                        '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="fr">' +
                        '<ul>' +
                        '<li class="list-info">' +
                        '<span class="name">用户评价:</span>' +
                        '<span class="num">暂无评价</span>' +
                        '</li>' +
                        '<li class="list-info">' +
                        '<span class="name">商品价格:</span>' +
                        '<span class="num">面议</span>' +
                        '</li>' +
                        '<li class="list-info">' +
                        '<a href="detail.html?goodsId=' + arry[q][z]['id'] + '" class="list-button" style="margin-right: .2rem">查看详情</a>' +
                        '<a href="javascript:void(0);" class="list-button">立即购买</a>' +
                        '</li>' +
                        '</ul>' +
                        '</div>' +
                        '</li>'
                }
                str += "</div>"
                str1 += "<a class='pagelink' href='javascript:void(0)' onclick='num(event," + (q) + ")'>" + (q + 1) + "</a>";
            }
            listImg.innerHTML = str;
            barcon.innerHTML = '<a class="pagelink" href="javascript:void(0)" onclick="num(event,-1)">上一页</a>'
                + str1 + '' +
                '<a class="pagelink" href="javascript:void(0)" onclick="num(event,1)">下一页</a>';
        }
    }
    dateAll[0].style.display = "block";
}
var index = 1;
var dq = 0;
function num(event, num) {
    var dateAll = document.getElementsByClassName("date");
    var barcon = document.getElementById("barcon");
    var objA = barcon.getElementsByClassName("pagelink");
    for (var i = 0; i < dateAll.length; i++) {
        dateAll[i].style.display = "none";
        objA[i].style.color = ''
    }
    event = event.target || window.event.target;
    if (event.innerText == "上一页") {
        if (dq >= 1) {
            dateAll[dq - 1].style.display = "block";
            dq -= 1;
        }
        dateAll[dq].style.display = "block";
        return
    } else if (event.innerText == "下一页") {
        if (dq < (dateAll.length - 1)) {
            dateAll[dq + 1].style.display = "block";
            dq += 1;
        }
        dateAll[dq].style.display = "block";
        return
    } else {
        if (index > num && index >= 1) {
            dateAll[index - 1].style.display = "block";
        } else if (num >= index) {
            dq = num;
            dateAll[num - index + 1].style.display = "block";
        }
    }
}
