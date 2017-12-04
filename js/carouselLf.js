;(function () {
    var bannerInner = document.getElementsByClassName('bannerInner')[0];
    var focusUl = document.getElementsByClassName('focusUl')[0];
    var right = document.getElementsByClassName('right')[0];
    var left = document.getElementsByClassName('left')[0];
    var bannerInfo = document.getElementsByClassName('banner-info');
    var imgs = bannerInner.getElementsByTagName('img');
    var lis = focusUl.getElementsByTagName('li');
    var index = 0;
    var data = null;
    var carousel = {
        //动画效果
        animate: function (ele, target, duration, step, mis, callback) {
            var _this = this;
            // target :设置样式属性 step :步长 mis 间隔多久执行一遍定时器
            // duration 终点
            var time = 0,
                begin = {},
                change = {};
            duration = duration || 1000;
            mis = mis || 10;
            for (var key in target) {
                begin[key] = _this.getCss(ele, key);
                change[key] = target[key] - begin[key];
            }
            /*负责动画*/
            window.clearInterval(ele.timer);
            ele.timer = window.setInterval(function () {
                time += step || 10;
                if (time >= duration) {
                    window.clearInterval(ele.timer);
                    for (var key in target) {
                        _this.setCss(ele, key, target[key]);
                    }
                    if (typeof  callback == 'function') {
                        callback.call(ele);
                    }
                    return;
                }
                for (var key in change) {
                    var val = begin[key] + time / duration * change[key];
                    _this.setCss(ele, key, val);
                }
            }, mis);
        },
        //获取样式
        getCss: function (ele, attr) {
            var value = null;
            if (window.getComputedStyle) {
                value = window.getComputedStyle(ele)[attr];
            } else {
                if (attr === "opacity") {
                    value = ele.currentStyle['filter'];
                    var reg = /^alpha\(opacity=(\d+(?:\.\d+))?\)$/;
                    value = reg.test(value) ? reg.exec(value[1] / 100) : 1;
                } else {
                    value = ele.currentStyle[attr];
                }
            }
            var reg = /^-?\d+(\.\d+)?(.)?$/;
            if (!reg.test(value)) {
                value = parseFloat(value);
            }
            return value;
        },
        //设置样式
        setCss: function (ele, attr, val) {
            if (attr == 'opacity') {
                ele.style.opacity = val;
                ele.style.filter = 'alpha(opacity=' + val * 100 + ')';
                return;
            }
            if (attr == 'float') {
                ele.style.cssFloat = val;
                ele.style.styleFloat = val;
                return;
            }
            var reg = /^(width|height|left|top|right|bottom|(margin|padding)(Left|Top|Right|Bottom)?)$/;
            if (reg.test(attr)) {
                if (!isNaN(val)) {
                    val += 'px';
                }
            }
            ele.style[attr] = val;
        },
        //获取数据
        getData: function () {
            var xhr = new XMLHttpRequest();
            xhr.open('get', '../data/carouselLF.json?_=' + Math.random(), false);
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    data = JSON.parse(xhr.responseText);
                }
            };
            xhr.send(null);
        },
        // 绑定数据
        bindData: function () {
            if (data) {
                var str = '';
                var strLi = '';
                for (var i = 0; i < data.length; i++) {
                    str += /*'<a href= "' + data[i].winPage + '"  target="_blank">' +*/
                        '<div>' +
                        '<div class="banner-info">' +
                        '<p class="banner-info-name">' +
                        '<i class="start"></i>' +
                        '<span>' + data[i].goodsNameF + '</span>' +
                        '<span> - </span>' +
                        '<span style="color:#f4d934;">' + data[i].goodsNameL + '</span>' +
                        '</p>' +
                        '<p class="banner-info-summary">' + data[i].goodsSummary + '</p>' +
                        '<a href="' + data[i].winPage + '" class="banner-info-button">' + data[i].goodsButton + '</a>' +
                        '</div>' +
                        '<img src="" real="' + data[i].src + '"></div>'
                    /*'</a>'*/;
                    // 第一个li需要单独处理有个cur选中样式
                    strLi += i == 0 ? '<li class="cur"></li>' : '<li></li>';
                }
                // 为了保证轮播的时候做无缝连接，需要在最后添加一个第一张图片
                str += /*'<a href= "' + data[0].winPage + '" target="_blank">' +*/
                    '<div>' +
                    '<div class="banner-info">' +
                    '<p class="banner-info-name">' +
                    '<span>' + data[0].goodsNameF + '</span>' +
                    '<span> - </span>' +
                    '<span style="color:#f4d934;">' + data[0].goodsNameL + '</span>' +
                    '</p>' +
                    '<p class="banner-info-summary">' + data[0].goodsSummary + '</p>' +
                    '<a href="' + data[0].winPage + '" class="banner-info-button">' + data[0].goodsButton + '</a>' +
                    '</div>' +
                    '<img src="" real="' + data[0].src + '">' +
                    '</div>'
                /*'</a>'*/;
                // 动态处理宽度，否则图片就会换行
                this.setCss(bannerInner, 'width', (data.length + 1) * 1050);
                bannerInner.innerHTML = str;
                focusUl.innerHTML = strLi;
            }
        },
        // 图片有效性验证
        showPic: function () {
            var _this = this;
            for (var i = 0; i < imgs.length; i++) {
                var tempImg = document.createElement('img');
                tempImg.index = i;
                tempImg.src = imgs[i].getAttribute('real');
                tempImg.onload = function () {
                    // 使用自定义属性来处理i的问题
                    imgs[this.index].src = this.src;
                    _this.animate(imgs[this.index], {opacity: 1}, null, null, 10)
                }
                tempImg = null;
            }
        },
        //图片播放
        autoPlay: function () {
            index++; // index++之后的值就是我要运动到的终点
            if (index == data.length + 1) { // 目前正在从最后一张往后播放，赶紧切换到第一张（直接切换）

                this.setCss(bannerInner, 'left', 0);
                index = 1; // 向第二张运动，索引index的值应该是第二张索引
            }
            this.animate(bannerInner, {left: -index * 1050}, 500, null);
            this.focusAlign(); // 更换图片之后焦点重新对齐
            this.infoAuto();
        },
        // 焦点对齐 => 轮播图片就需要重新执行
        focusAlign: function () {
            // 当播放到最后一张图片(显示的是第一张)但是lis中没有对应的li。所以让第一张显示
            var tempIndex = index == lis.length ? 0 : index;
            for (var i = 0; i < lis.length; i++) {
                // 索引值和index相同的li添加cur样式否则移除
                lis[i].className = i == tempIndex ? 'cur' : '';
            }
        },
        //导航条焦点事件
        navigation: function () {
            for (var i = 0; i < lis.length; i++) {
                lis[i].index = i;
                lis[i].onmouseover = function () {
                    index = this.index;
                    carousel.animate(bannerInner, {left: -index * 1050}, 500, null);
                    carousel.focusAlign();
                    carousel.infoAuto();
                }
            }
        },
        infoAuto: function () {
            var sT = null;
            try {
                clearTimeout(sT);
            } catch (e) {
            }
            sT = setTimeout(function () {
                for (var i = 0; i <= bannerInfo.length; i++) {
                    try {
                        bannerInfo[i].style.cssText = 'top:-50%';
                    } catch (e) {
                    }
                    if (index == i) {
                        if (index == data.length - 1) {
                            var start = bannerInfo[i].getElementsByTagName('i')[0];
                            start.style.cssText = 'background: url("../images/start.png") no-repeat center;'
                        }
                        bannerInfo[i].style.cssText = 'top:.6rem'
                    }
                }
            }, 1000)
        },
        //方法初始化
        init: function () {
            this.getData();
            this.bindData();
            this.showPic();
            this.infoAuto();
            var timer = window.setInterval(function () {
                carousel.autoPlay()
            }, 5000);
            this.navigation();
        }
    };
    carousel.init();
})();