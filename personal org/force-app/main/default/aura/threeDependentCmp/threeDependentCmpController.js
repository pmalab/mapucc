({
    doInit : function(component, event, helper) { 
        // get the fields API name and pass it to helper function  
        var controllingFieldAPI = component.get("v.controllingFieldAPI");
        var controllingFieldAPI2 = component.get("v.controllingFieldAPI2");
        var dependingFieldAPI = component.get("v.dependingFieldAPI");

        var objDetails = component.get("v.objDetail");
        // call the helper function
        helper.fetchPicklistValues(component,objDetails,controllingFieldAPI,controllingFieldAPI2,dependingFieldAPI);
    },
    
    onControllerFieldChange: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        console.log('controllerValueKey==='+controllerValueKey);
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
         
        if (controllerValueKey != '--- None ---') {
        	var twoMap = depnedentFieldMap[controllerValueKey];
        	var listOfkeys = [];
    	  	for (var singlekey in twoMap) {
                listOfkeys.push(singlekey);
            }

            var ControllerFields = [];
            for (var i = 0; i < listOfkeys.length; i++) {
                ControllerFields.push(listOfkeys[i]);
            }  
            if(ControllerFields.length > 0){
                component.set("v.bDisabledControllerFld" , false);  
                helper.fetchDepValues2(component, ControllerFields);
              

            }else{
                component.set("v.bDisabledControllerFld" , true); 
                component.set("v.listControllingValues2", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listControllingValues2", ['--- None ---']);
            component.set("v.bDisabledControllerFld" , true);
        }
         component.set("v.listDependingValues", ['--- None ---']);
         component.set("v.bDisabledDependentFld" , true);
    },
     onControllerFieldChange2: function(component, event, helper) {     
        var controllerValueKey = event.getSource().get("v.value"); // get selected controller field value
        var depnedentFieldMap = component.get("v.depnedentFieldMap");
        
        if (controllerValueKey != '--- None ---') {
        	var first = component.get("v.objDetail.Country__c");
        	//console.log('=============='+first);
        	var twoMap = depnedentFieldMap[first];
            var ListOfDependentFields = twoMap[controllerValueKey];
            
            if(ListOfDependentFields.length > 0){
                component.set("v.bDisabledDependentFld" , false);  
                helper.fetchDepValues(component, ListOfDependentFields);    
            }else{
                component.set("v.bDisabledDependentFld" , true); 
                component.set("v.listDependingValues", ['--- None ---']);
            }  
            
        } else {
            component.set("v.listDependingValues", ['--- None ---']);
            component.set("v.bDisabledDependentFld" , true);
        }
    },
})