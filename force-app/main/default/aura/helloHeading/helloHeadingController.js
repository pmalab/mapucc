({
    function_name :  function(component, event, helper){
        //called on clicking your button
        //run your form render code after that, run the following lines
        component.set("{!v.body}", component);
        helper.showPopupHelper(component, 'modaldialog', 'slds-fade-in-');
        helper.showPopupHelper(component,'backdrop','slds-backdrop--');
	},
    hidePopup : function(component, event, helper){
        
        helper.hidePopupHelper(component, 'modaldialog', 'slds-fade-in-');
		helper.hidePopupHelper(component, 'backdrop', 'slds-backdrop--');
	},
    openModal : function(component, event, helper) {
        helper.openModal(component, event);
    },
    closeModal : function(component, event, helper) {
        helper.closeModal(component, event);
    }
    
    
})