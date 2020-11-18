({
    doInit : function(component, event, helper) {
        //get inventory record Id
        var action = component.get("c.getInventory");
        action.setParams({"inventoryId" : component.get("v.recordId")});
 
        //configure action handler
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                component.set("v.inventory", response.getReturnValue());
            }else{
                console.log('Problem getting Product, response state : '+state);
            }
        });
        $A.enqueueAction(action);
    },
    requestCall: function(component, event, helper) {
        //prepare action for update inventory
        var updateCall = component.get("c.updateInventoryCall");
        var pro = component.get("v.inventory");
        updateCall.setParams({
            "inv" : component.get("v.inventory")
        });


        var state = pro.state__c;
        console.log("state===="+state);
        if(state == true){
        	var resultsToast = $A.get("e.force:showToast");//
            resultsToast.setParams({
                "title" : "Record modified",
                "message" : "Record has been modified,no need modify again!"
            });

            //Update the UI: closePanel, show toast, refresh page
            $A.get("e.force:closeQuickAction").fire();
            resultsToast.fire();
	        //$A.get("e.force:refreshView").fire();
        }else{
        	updateCall.setCallback(this, function(response){
	            var state = response.getState();
	            if(state === "SUCCESS"){
	                var resultsToast = $A.get("e.force:showToast");//
	                resultsToast.setParams({
	                    "title" : "Record modified",
	                    "message" : "Record has been modified."
	                });
	 
	                //Update the UI: closePanel, show toast, refresh page
	                $A.get("e.force:closeQuickAction").fire();
	                resultsToast.fire();
	                $A.get("e.force:refreshView").fire();
	            }else if(state === "ERROR"){
	                console.log('Problem updating status, response state '+state);
	            }else{
	                console.log('Unknown problem: '+state);
	            }
	        });
        }
        
        //configure response handler for this action
       /* updateCall.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var resultsToast = $A.get("e.force:showToast");//
                resultsToast.setParams({
                    "title" : "Record modified",
                    "message" : "Record has been modified."
                });
 
                //Update the UI: closePanel, show toast, refresh page
                $A.get("e.force:closeQuickAction").fire();
                resultsToast.fire();
                $A.get("e.force:refreshView").fire();
            }else if(state === "ERROR"){
                console.log('Problem updating status, response state '+state);
            }else{
                console.log('Unknown problem: '+state);
            }
        });*/
        //send the request to updateCall
        $A.enqueueAction(updateCall);
 
 
    },
    cancelCall: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    }
})