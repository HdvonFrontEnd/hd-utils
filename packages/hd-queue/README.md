# Hd-Queue

用于管理并发任务

通过push方法往任务队列（waitList）推入任务

如果执行中的任务数量（aRunning）不超过最大同时执行任务数（concurrency），则立即调用go方法

在go方法中，会不断从waitList中获取任务并执行，如果已经满了（this.aRunning.length ===this.thread）就等待

另外push方法经过promise封装，如果推入的任务得到执行，则会被resolve或reject

详细文档见：