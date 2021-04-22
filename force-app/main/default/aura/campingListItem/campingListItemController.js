({
        doInit : function(component, event, helper) {
                /*var mydate = component.get("v.expense.Date__c");
                if(mydate){
                    component.set("v.formatdate", new Date(mydate));
                }*/
        },
	//packitem的控制类方法
	packItem : function(component, event, helper) {
		//component.set('v.item.Packed__c',true);
		/*var a=component.get('v.item',true);
        a.Packed__c=true;
        component.set('v.item',a);
        event.getSource().set('v.disabled',true);*/
        var a = component.get("v.item",true);
        a.Packed__c = true;
        component.set("v.item",a);
        var btnClicked = event.getSource();
        btnClicked.set("v.disabled",true);
	}
})