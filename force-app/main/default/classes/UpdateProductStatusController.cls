public with sharing class UpdateProductStatusController {
 
    @AuraEnabled
    public static Product__c getInventory(Id inventoryId){
                //make your own SOQL here from your desired object where you want to place your lightnign action
        return [SELECT Name, Id, state__c FROM Product__c
        WHERE Id = :inventoryId ];
    }
 
    @AuraEnabled
    public static Product__c updateInventoryCall(Product__c inv){
        //you can make your own update here.
        inv.state__c = True;
        upsert inv;
        return inv;
    }
}