/*
* sherlock.chen@celnet.com.cn
* 2018-01-15
* 
*/
({
	// 初始化方法-查询出全部的Account，limit 50
	doInit : function(component, event, helper){
		helper.loadAccounts(component,event);
	},

	// 带条件的查询方法
    doSearch : function(component, event, helper) {
    	// 获取id为searchKeyId的标签
    	var searchKey = component.find("searchKeyId");
    	// 获取标签里的值
    	var srcValue = searchKey.get("v.value");
    	
    	if(srcValue == '' || srcValue == null){
    		searchKey.set("v.errors",
    			[{
    				message : "请输入搜索关键字"
    			}]);
    		//console.log('bbbb');
    	}else{
    		//console.log('aaaa');
    		//searchKey.set("v.errors",null);
    		helper.doSearch(component, event);
    	}
    }
})