@isTest
private class TotalMoneyTest {
    static testMethod void testMethod1() {
        Reimbursement__c rei = new Reimbursement__c();
        Insert rei;

        ReimbursementSelect__c res = new ReimbursementSelect__c();
        res.Name='ccc';
        res.state__c=false;
        res.money__c=0;
        res.ReimbursementId__c = rei.Id; 
        Insert res;
        
       // rei.Name = 'FY-2017-02-220006';

        TotalMoney.getTotalMoney(rei.Id);
        //Apexpages.CurrentPage().getParameters().put('id',rei.Id);
        //TotalMoney tm = new TotalMoney();



    }
}