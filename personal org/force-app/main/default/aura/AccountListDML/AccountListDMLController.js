({
	// 初始化方法
    doInit : function(component, event, helper) {
    	// $A.util.toggleClass 是一个开关,开是加上,关是移除
        $A.util.toggleClass(component.find("comfirmDialog"), "slds-fade-in-open");
        $A.util.toggleClass(component.find("comfirmDialogBackdrop"), "slds-backdrop--open");
        
        helper.loadAccounts(component);
    },
    // 添加行
    addRow : function(component, event, helper) {
    	var obj = new Object();
    	// obj.id = '';
    	obj.checkbox = false;
    	obj.Name = '';
    	obj.Phone = '';
    	obj.AccountSource = '';
    	var accList = component.get("v.accountlist");
    	accList.push(obj);
    	component.set("v.accountlist", accList);
    },

    // 删除行
    delRow : function(component, event, helper) {

    	var acclist = component.get("v.accountlist");
    	var newacclist = new Array();
    	var falg = true;
    	for(var i = 0; i <= acclist.length-1; i++){
    		if(!acclist[i].checkbox){
    			newacclist.push(acclist[i]);
    		}
    	}
    	//console.log('newacclist.length:'+newacclist.length);
    	if(acclist.length != newacclist.length){
    		component.find("Allbox").set("v.value",false);
	    	component.set("v.accountlist",newacclist);
	    	component.set("v.selectedCount",0);
    	}else{
    		var toastEvent = $A.get("e.force:showToast");
    		toastEvent.setParams({
    			"title" : "删除行提示",
    			"type" : "error",
    			"message" : "请勾选一行进行删除"
    		});
    		// 释放事件（提示信息）
            toastEvent.fire();
    	}
    },

    // 保存数据
    saveAll : function(component, event, helper) {
    	var acclist = component.get("v.accountlist");
    	var saveList = new Array();
    	for (var i=0;i<acclist.length;i++){
			if(acclist[i].checkbox ){
				//console.log('name===>>'+acclist[i].Name);
				if(acclist[i].Name!="" && typeof(acclist[i].Name) != "undefined"){
                    //console.log('name in ===>>'+acclist[i].Name);
                    saveList.push(acclist[i]);
				}else{
					helper.showToast('error','客户名不能为空！');

				}

			}
		}
		if(saveList.length>0){
            helper.saveAccount(component,saveList);
		}else{
            helper.showToast('error','请选择一条客户记录进行保存！');
		}

    	// 判断Name是否为空
    	/*var accList = component.get("v.accountlist");
    	var isNameNull = false;
    	for(var i = 0; i <= accList.length-1; i++){
    		if(accList[i].Name == ''){
    			isNameNull = true;
    			break;
    		}
    	}
    	if(isNameNull){
    		//toast是一个消息弹出框,非模态框,是一个事件,只能在Lighting框加中使用
    		var toastEvent = $A.get("e.force:showToast");
    		toastEvent.setParams({
    			"title" : "",
    			"type" : "error",
    			"message" : "客户名不能为空！"
    		});
    		// 释放事件（提示信息）
            toastEvent.fire();
    	}else{
    		helper.saveAccount(component);
    	}*/
    },

    // 确认是否删除：点击弹出模态框
    confirmDel : function(component, event, helper) {
    	$A.util.toggleClass(component.find("comfirmDialog"), "slds-fade-in-open"); // 模态框
    	$A.util.toggleClass(component.find("comfirmDialogBackdrop"), "slds-backdrop--open"); // 背景置灰效果
    },

    // 删除客户
    delAccount : function(component, event, helper) {
    	$A.util.toggleClass(component.find("comfirmDialog"), "slds-fade-in-open");
        $A.util.toggleClass(component.find("comfirmDialogBackdrop"), "slds-backdrop--open");

        var acclist = component.get("v.accountlist");
        // 剩余的未删除的数据
        var newacclist = new Array();
        // 需要删除的数据
        var delacclist = new Array();

        for(var i = 0; i <= acclist.length-1; i++){
        	// 需要删除的客户
        	if(acclist[i].checkbox){
        		delacclist.push(acclist[i]);
        	}else{ // 不需要删除的客户
        		newacclist.push(acclist[i]);
        	}
        }
        console.log(delacclist.length);
        if(delacclist.length == 0){
        	var toastEvent = $A.get("e.force:showToast");
    		toastEvent.setParams({
    			"title" : "删除行提示",
    			"type" : "error",
    			"message" : "请勾选一行进行删除"
    		});
    		// 释放事件（提示信息）
            toastEvent.fire();
        }else{
        	helper.deleteAccount(component,newacclist,delacclist);
        	helper.saveAccount(component,newacclist);
        }
    },

    // 全选方法
    selectAll : function(component, event, helper) {
        //获取标题复选框的值
        var selectedHeaderCheck = event.getSource().get("v.value");
        //返回所有复选框元素的列表
        var getAllId = component.find("box");
        if(selectedHeaderCheck == true){
            for(var i = 0; i < getAllId.length; i++){
                component.find("box")[i].set("v.value", true);
                component.set("v.selectedCount", getAllId.length);
            }
        }else{
            for (var i = 0; i < getAllId.length; i++){
                component.find("box")[i].set("v.value", false);
                component.set("v.selectedCount", 0);
            }
        }
    }


})