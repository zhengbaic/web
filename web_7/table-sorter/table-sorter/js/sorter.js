/**
 * Created by bytrain on 2016/10/27.
 */
var set, trs, is_ascend = true;
var SortByOrder = function (target) {//排序
    var num = parseInt(target.id.split("_")[3]);
    var that_id = target.id.split("_")[0] + "_" +  target.id.split("_")[1];
    trs = $("#"+that_id + " tbody tr");
    trs.each(function (i) {
        if($("thead").length == 0) { //如果只是用一个tbody来做表格 则忽略表头的tr
            if(i != 0){
                var td = $("#"+ this.id + " td")[num];
                set.push(td.textContent);
            }
        }else {
            var td = $("#"+ this.id + " td")[num];
            set.push(td.textContent);
        }
    });
    var size = trs.length;
    for(var i = 0; i < size; i++) {//为内容排序
        for(var j = i + 1; j < size; j++){
            var obi = $("#" + target.id + "_tr_" + i);
            var obj = $("#" + target.id + "_tr_" + j);
            if(is_ascend){
                if(set[i] < set[j]) obj.after(obi);
            }
            else{
                if(set[i] > set[j]) obj.after(obi);
            }
        }
    }
};
var ChangeCss = function (ob) {//改变样式
    if(is_ascend){
        is_ascend = false;
        ob.className = "up";
    }else {
        is_ascend = true;
        ob.className = "down";
    }
};
var ThClickListen = function (e) {//事件处理器
    set = [];
    $("th").attr("class", "");
    $("#"+this.id + " tbody tr").each(function (i) {
        $(this).attr("class", "");
        if($("thead").length != 0) $(this).attr("id", e.target.id + "_tr_" + i);//如果只是用一个tbody来做表格 则忽略表头的tr
        else {
            if(i != 0) $(this).attr("id", e.target.id + "_tr_" + (i-1));
        }
    });
    if(e.target.tagName.toUpperCase() === "TH") {
        ChangeCss(e.target);
        SortByOrder(e.target);
    }
    $("tr").attr("class", "");
    $("tr:even").attr("class", "alternate");
};
var run = function () {
    $("table").each(function (i) {
        var that = this;
        $(this).attr("id", "table_"+ i).on("click", ThClickListen);//set unique id
        $("#"+this.id + " tr:even").attr("class", "alternate");//all ood turn grey
        $("#"+this.id + " th").each(function (i) {
            $(this).attr("class", "");
            $(this).attr("id", that.id + "_th_" + i);
        });
    });
};
window.onload = run;