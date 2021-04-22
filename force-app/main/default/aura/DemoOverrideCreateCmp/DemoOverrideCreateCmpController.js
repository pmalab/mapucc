({
    doInit : function(component, event, helper) {
    	var createAcountContactEvent = $A.get("e.force:createRecord");
		createAcountContactEvent.setParams({
		    "entityApiName": "Contact",
		    "defaultFieldValues": {
		        'Phone' : '415-240-6590'
		    }
		});
		createAcountContactEvent.fire();
    }
})