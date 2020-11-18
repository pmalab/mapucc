({
	/*createItem : function(component, newCampingItem) {
        var action = component.get("c.saveItem");
            action.setParams({
                "camping_Item": newCampingItem
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    var campingss = component.get("v.items");
                    campingss.push(response.getReturnValue());
                    component.set("v.items", campingss);
                    component.set("v.newItem",{ 'sobjectType': 'Camping_Item__c','Name': '','Quantity__c': 0,
                                           'Price__c': 0,'Packed__c': false });
                }
            });
            $A.enqueueAction(action);
    },*/

    saveItem: function(component, newCampingItem, callback) {
        var item = newCampingItem;
        var action = component.get("c.saveItem");
        action.setParams({
            "item": item
        });
        if (callback) {
            action.setCallback(this, callback);
        }
        $A.enqueueAction(action);
    },

    createItem: function(component, newCampingItem) {
        console.log("newCampingItem======:"+JSON.stringify(newCampingItem));
        this.saveItem(component, newCampingItem, function(response){
            var state = response.getState();
            console.log("state======:"+state);
            if (state === "SUCCESS") {
                var campingss = component.get("v.items");
                    console.log("campingss======:"+JSON.stringify(campingss));
                    campingss.push(response.getReturnValue());
                    component.set("v.items", campingss);
                   
            }
        });
    },
})