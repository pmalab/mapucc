/**
 * 
 */
public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountList() {
        return [
            SELECT Id, Name
            FROM Account
            ORDER BY CreatedDate DESC
            // WITH SECURITY_ENFORCED
            LIMIT 10
        ];
    }

    @AuraEnabled(cacheable=true)
    public static Account getSingleAccount() {
        return [
            SELECT Id, Name, Phone, Type
            FROM Account
            WITH SECURITY_ENFORCED
            LIMIT 1
        ];
    }

    @AuraEnabled
    public static WrapperClass getRequest(){
        try {
            WrapperClass wrapper = new WrapperClass();
            wrapper.status = true;
            List<ContactWrapper> lstCW = new List<ContactWrapper>();
            ContactWrapper cw1 = new ContactWrapper();
            cw1.id = '1';
            cw1.name = 'name1';
            cw1.title = 'title1';
            ContactWrapper cw2 = new ContactWrapper();
            cw2.id = '2';
            cw2.name = 'name2';
            cw2.title = 'title2';
            ContactWrapper cw3 = new ContactWrapper();
            cw3.id = '3';
            cw3.name = 'name3';
            cw3.title = 'title3';
            lstCW.add(cw1);
            lstCW.add(cw2);
            lstCW.add(cw3);
            wrapper.lstContactWrapper = lstCW;
            return wrapper;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static string submitRequest(WrapperClass resultWrapper){
        try {
            system.debug('in======');
            system.debug('resultWrapper==='+resultWrapper);
            return 'ok';
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class WrapperClass{
        @AuraEnabled
        public boolean status{get;set;}
        @AuraEnabled
        public String msg{get;set;}
        @AuraEnabled
        public List<ContactWrapper> lstContactWrapper{get;set;}

    }

    public class ContactWrapper{
        @AuraEnabled
        public string id{get;set;}
        @AuraEnabled
        public object name{get;set;}
        @AuraEnabled
        public string title{get;set;}
    }
}