（不要吐槽我的样式hh，因为一开始没有想到大气泡上面就是大气泡里面，觉得根本放不下啊，而且这样更直观啊）
理解：以顺序ABCDE为例，我的理解是A执行逻辑，到B如果出错，则重新调用callbacks[1]，直到B无错，再调用callback[2]，执行C的逻辑

闭包的设计，callbacks[i]跟order[i]的绑定，第i个callback有第i个按钮的调用，如果第i个按钮出错，则回调callback[i]

一开始用try catch 后来听说不让用就直接callback（error， data）了

