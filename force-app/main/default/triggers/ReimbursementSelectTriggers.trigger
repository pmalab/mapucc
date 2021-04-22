trigger ReimbursementSelectTriggers on ReimbursementSelect__c (after insert) {
    new Triggers().bind(Triggers.Evt.afterInsert,new ReimbursementSelectHandler()).manage();
    // new Triggers().bind(Triggers.Evt.beforeInsert, new AccountHandler())
}