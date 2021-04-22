public without sharing class CmpCheckResListController {
    
    @AuraEnabled
    public static string getResDetails(String recordID){
        try {
            List<ReimbursementSelect__c> payments = [SELECT Id,Name, state__c, MoneyBigType__c, money__c 
                                                    FROM ReimbursementSelect__c
                                                    WHERE ReimbursementId__c =:recordID ];
            List<PaymentWrapper> wrappers = new List<PaymentWrapper>();
            for(ReimbursementSelect__c pay: payments){
                PaymentWrapper wrapper = new PaymentWrapper();
                wrapper.flag = false;
                if(!pay.state__c){
                    wrapper.flag = true;
                }
                wrapper.id = pay.Id;
                wrapper.name = pay.name;
                wrapper.category = pay.MoneyBigType__c;
                wrapper.status = pay.state__c;
                wrapper.money = pay.money__c;
                wrapper.url = '/lightning/r/ReimbursementSelect__c/'+pay.Id+'/view';
                wrappers.add(wrapper);
            }
            return Json.serialize(wrappers);
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage()+'--------'+ex.getStackTraceString());
        }
    }



    public class PaymentWrapper{
        @AuraEnabled
        public boolean flag;
        @AuraEnabled
        public string id;
        @AuraEnabled
        public string name;
        @AuraEnabled
        public string category;
        @AuraEnabled
        public Boolean status;
        @AuraEnabled
        public Decimal money;
        @AuraEnabled
        public string url;
    }
    
}
