({
    // 初始化加载客户数据
    loadAccounts : function(cmp) {
    	var action = cmp.get("c.loadAccounts");
    	action.setCallback(this, function(response){
    		var state = response.getState();
    		//console.log(state);
    		if(cmp.isValid() && state == 'SUCCESS'){ // cmp.isValid() 指组件没有被销毁
    			cmp.set("v.accountlist", response.getReturnValue()); // 将后台获取的数据放到页面属性中
    			cmp.find("Allbox").set("v.value",false);
                console.log(cmp.get("v.accountlist"));
    			cmp.set("v.selectedCount", 0);
    			// 数据加载完成之后关闭loading效果
    			var spinner = cmp.find("mySpinner");
    			$A.util.toggleClass(spinner,"slds-hide");
    		}
    	});
    	$A.enqueueAction(action);
    },

    // 保存客户
    saveAccount : function(cmp,acclist) {
    	// 调用加载效果
    	var spinner = cmp.find("mySpinner");
    	$A.util.toggleClass(spinner, "slds-hide");

    	// var acclist = cmp.get("v.accountlist");
    	
    	// 序列化 List To Json
    	var accListJson = JSON.stringify(acclist);

    	// console.log(accListJson);
    	// 调用服务器端controller
    	var action = cmp.get("c.saveAccount");
    	action.setParam("jsons",accListJson);
    	
    	action.setCallback(this, function (response){
    		var toastEvent = $A.get("e.force:showToast"); // 定义提示消息
    		var state = response.getState();
    		if(cmp.isValid() && state == "SUCCESS"){
    			toastEvent.setParams({
    				"title" : "保存提示",
    				"message" : "保存成功！",
    				"type" : "success"
    			});
    		}
    		if(cmp.isValid() && state == "ERROR"){
    			toastEvent.setParams({
    				"title" : "保存提示",
    				"message" : "保存失败！" + response.getError()[0].message,
    				"type" : "error"
    			});	
    		}
    		$A.util.toggleClass(spinner, "slds-hide");
    		toastEvent.fire();
    	});
    	$A.enqueueAction(action);
    },

    // 删除客户
    deleteAccount : function(cmp,newacclist,delacclist){
    	//调用加载效果
     	var spinner = cmp.find("mySpinner");
        $A.util.toggleClass(spinner, "slds-hide");
        // 序列化：dellist->json
        var delListJson = JSON.stringify(delacclist);
        // 调用服务器方法
    	var action = cmp.get("c.deleteAccount");
    	action.setParam("jsons",delListJson);
    	action.setCallback(this, function (response){
    		var toastEvent = $A.get("e.force:showToast");
    		var state = response.getState();
    		cmp.set("v.accountlist", newacclist);
    		if (cmp.isValid() && state == "SUCCESS") 
            {
                toastEvent.setParams({
                    "title" : "Success!",
                    "message" : "删除成功!",
                    "type" : "success"
                });
            }
            if (cmp.isValid() && state === "ERROR") 
            {
                toastEvent.setParams({
                    "title" : "Success!",
                    "message" : "删除失败" + response.getError()[0].message,
                    "type" : "error"
                });
            }
            $A.util.toggleClass(spinner, "slds-hide");
            toastEvent.fire();

    	});
    	$A.enqueueAction(action);
    },

    showToast : function(type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": type,   //error, warning, success, or info.
            "message": message
        });
        toastEvent.fire();
    }


})