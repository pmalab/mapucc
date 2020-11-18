({
    clickCreateItem: function(component, event, helper) {
         	var newCampingItems = component.get("v.newItem");
         	//console.log("newCampingItems======="+newCampingItems);
         //console.log("JSON.stringify(newCampingItem)======="+JSON.stringify(newCampingItems));
         	var items = JSON.parse(JSON.stringify(newCampingItems));
         	//console.log("items======="+items);
            var validCamping = component.find('campaignform').reduce(function (validSoFar, inputCmp) {
                // Displays error messages for invalid fields
                inputCmp.showHelpMessageIfInvalid();
                return validSoFar && inputCmp.get('v.validity').valid;
            }, true);
            
            if(validCamping){
    
                var newCampingItem = component.get("v.newItem");
                var item = JSON.parse(JSON.stringify(newCampingItem));
                helper.createItem(component, newCampingItem);           
            }
    
     }
})