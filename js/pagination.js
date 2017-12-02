var obj, j;
var page = 0;
var nowPage = 0;//当前页
var listNum = 1;//每页显示数
var PagesLen;//总页数
var PageNum = 3;//分页链接接数(5个)
/*onload = function () {*/
    obj = document.getElementById("listImg").getElementsByClassName("detail-list-info ");
    j = obj.length;
    PagesLen = Math.ceil(j / listNum);
    upPage(0);
/*}*/
function nextPage() {
    var newVal = nowPage - 1;
    if (newVal >= 0) {
        upPage(newVal);
    }
}
function upPageFoot() {
    var newVal = nowPage + 1;
    if (newVal < (PagesLen - 1)) {
        upPage(newVal);
    } else if (newVal = (PagesLen - 1)) {
        upPage(newVal);
    }
}
function upPage(p) {
    nowPage = p//内容变换
    for (var i = 0; i < j; i++) {
        obj[i].style.display = "none"
    }
    for (var i = p * listNum; i < (p + 1) * listNum; i++) {
        if (obj[i]) {
            obj[i].style.display = "block"
        }
    }
    //分页链接变换
    strS = '<a href="javascript:void(0);" onclick="upPage(0)">首页</a>';
    strS1 = '<a href="javascript:void(0);" onclick="nextPage()">上一页</a>';
    var PageNum_2 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) + 1 : Math.ceil(PageNum / 2);
    var PageNum_3 = PageNum % 2 == 0 ? Math.ceil(PageNum / 2) : Math.ceil(PageNum / 2) + 1;
    var strC = "", startPage, endPage;
    if (PageNum >= PagesLen) {
        startPage = 0;
        endPage = PagesLen - 1;
    } else if (nowPage < PageNum_2) {
        startPage = 0;
        endPage = PagesLen - 1 > PageNum ? PageNum : PagesLen - 1;
    } else {
        startPage = nowPage + PageNum_3 >= PagesLen ? PagesLen - PageNum - 1 : nowPage - PageNum_2 + 1;
        var t = startPage + PageNum;
        endPage = t > PagesLen ? PagesLen - 1 : t;
    }
    for (var i = startPage; i <= endPage; i++) {
        if (i == nowPage) {
            strC += '<a href="javascript:void(0);" style="color:#fff;background:#00a0ea; font-weight:700;" onclick="upPage(' + i + ')">' + (i + 1) + '</a> '
        } else {
            strC += '<a href="javascript:void(0);" onclick="upPage(' + i + ')">' + (i + 1) + '</a> '
        }
    }
    strE1 = ' <a href="javascript:void(0);" onclick="upPageFoot()">下一页</a>  ';
    strE = ' <a href="javascript:void(0);" onclick="upPage(' + (PagesLen - 1) + ')">尾页</a>  ';
    strE2 = nowPage + 1 + "/" + PagesLen + "页" + "  共" + j + "条";
    if (PagesLen < 3) {
        document.getElementById("barcon").innerHTML = strS1 + strC + strE1;
    } else {
        document.getElementById("barcon").innerHTML = strS + strS1 + strC + strE1 + strE + strE2
    }

}