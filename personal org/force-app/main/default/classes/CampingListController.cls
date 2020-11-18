/*
  date:2018/04/09
  author:mapu
  function:Camping_Item__c新建的自定义 lightning 页面的后台类
*/
public class CampingListController {

    @AuraEnabled
    public static List<Camping_Item__c> getItems() {
        return [SELECT ID,NAME,Price__c,Quantity__c,Packed__c
        		FROM Camping_Item__c];
    }

    @AuraEnabled
    public static Camping_Item__c saveItem(Camping_Item__c item) {
        UPSERT item;
        return item;
    }
}