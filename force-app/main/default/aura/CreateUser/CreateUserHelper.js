({  
    save: function(component, name, password, email, nickname) {
        // Create a user record, save it, and close the panel
        var userRecord = {apiName: 'Test_User__c', fields: {}};
        userRecord.fields.Name = {value: name};
        userRecord.fields.Password__c = {value: password};
        userRecord.fields.Email__c = {value: email};
        userRecord.fields.Nickname__c = {value: nickname};
        userRecord.fields.Case_Study__c = {value: component.get("v.recordId")};
        // get the force:recordData and set the targetRecord
        component.find("frd").set('v.targetRecord', userRecord); 
        // invoke saveRecord of force:recordData
        component.find("frd").saveRecord($A.getCallback(function(response) {
            if (component.isValid() && response.state == "SUCCESS") {
                $A.get("e.force:closeQuickAction").fire();
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                	"title": "Success!",
                    "message": "The test user has been created."
                });
                toastEvent.fire();		
                $A.get('e.force:refreshView').fire();
            } else if (response.state == "ERROR") {
                console.log('There was a problem and the state is: '+ response.state);
            }
        }));
    },
    
    validatePassword : function(component, event, helper) {
        var inputCmp = component.find("userPassword");
        var value = inputCmp.get("v.value");
        
        if (value == undefined) {
           inputCmp.set("v.errors", [{message: "You must enter a password."}]);
        } else if (value.length < 7 || value.length > 15) {
            inputCmp.set("v.errors", [{message: "The password is the wrong length (must be <= 15): " + value.length}]);
        } else if (value.search(/[0-9]+/) == -1) {
            inputCmp.set("v.errors", [{message: "The password must contain at least one number."}]);
        } else if (value.search(/[a-zA-Z]+/) == -1) {
            inputCmp.set("v.errors", [{message: "The password must contain at least one letter."}]);
        } else {
            inputCmp.set("v.errors", null);
        }
	},
    
    validateEmail : function(component, event, helper) {
        var inputCmp = component.find("userEmail");
        var value = inputCmp.get("v.value");
        
        if (value == undefined) {
           inputCmp.set("v.errors", [{message: "You must enter an email."}]);
           return;
        }
        
        var apos = value.indexOf("@");
        var dotpos = value.lastIndexOf(".");
        if (apos<1||dotpos-apos<2){
            inputCmp.set("v.errors", [{message: "Email is not in the correct format: " + value}]);
        } else if (value.substring(apos+1, dotpos) != "gmail") {
            inputCmp.set("v.errors", [{message: "Email must be a gmail account: " + value.substring(apos+1, dotpos)}]);
        } else {
            inputCmp.set("v.errors", null);
        }
	}
})