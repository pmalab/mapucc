global class ReiBatch implements Database.Batchable<sObject> {
    /*public String query;

    global ReiBatch() {
        this.query = query;
    }*/

    global Database.QueryLocator start(Database.BatchableContext bc) {

        return Database.getQueryLocator([Select Id,name,status__c,check__c from Reimbursement__c where status__c=false]);
    }

    global void execute(Database.BatchableContext BC, list<Sobject> scope) {

       // List<Reimbursement__c> rc = new List<Reimbursement__c>();
        
        for(Reimbursement__c c : (List<Reimbursement__c>)scope)
            {       
                    if(c.check__c == '审核通过')
                        {
                            c.status__c = true;
                            //rc.add(c);
                        }
            }
            //update rc;
            update scope;
    }

    global void finish(Database.BatchableContext BC) {

    }
}