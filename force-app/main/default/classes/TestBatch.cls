global class TestBatch implements Database.Batchable<sObject> {
    public String query;

    global TestBatch() {
        this.query = query;
    }

    global Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, list<Sobject> scope) {
        
    }

    global void finish(Database.BatchableContext BC) {

    }
}