({
	// 初始化加载Account limit 50
	loadAccounts : function(component,event){
		// 调用后台类
		var action = component.get("c.loadAccounts");
		// 设置回调函数
		action.setCallback(this,function(response){
			// 返回状态
			var state = response.getState();
			if(state == 'SUCCESS'){
				var resp_list = response.getReturnValue();
				if(resp_list == 0){
					component.set("v.message",true);
				}else{
					component.set("v.message",false);
				}
				component.set("v.recordsNum",resp_list.length);
				component.set("v.results",resp_list);
			}
		});
		// 队列处理
		$A.enqueueAction(action);
	},

	// 查询
    doSearch : function(component, event) {
    	// 调用后台apex方法
    	var action = component.get("c.fetchAccount");
    	// 调用后台apex方法-设置参数
    	action.setParams({
    		'searchKey' : component.get("v.searchKey")
    	});
    	// 设置回调函数
    	action.setCallback(this,function(response){
    		// 返回状态
    		var state = response.getState();
    		if(state == 'SUCCESS'){
    			var resp_list = response.getReturnValue();
    			if(resp_list.length == 0){
    				component.set("v.message",true);
    			}else{
    				component.set("v.message",false);
    			}
    			component.set("v.recordsNum",resp_list.length);
    			component.set("v.results",resp_list);
    		}
    	});
		// 队列处理
		$A.enqueueAction(action);
    }
})