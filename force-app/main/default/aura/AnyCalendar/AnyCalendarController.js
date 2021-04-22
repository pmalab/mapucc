({
    scriptsLoaded : function(component, event, helper) {
    	var expenseId = component.get("v.expenseId");
    	//console.log("expenseId=="+expenseId);
        helper.getEvents(component, event);
    }
})