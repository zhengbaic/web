禁用请求：
    xhr[i] = $.get();
    for(var i = 0; i< 5; i++) {
            if(xhr[i]) xhr[i].abort();
    }
    
其他任务也是这样实现