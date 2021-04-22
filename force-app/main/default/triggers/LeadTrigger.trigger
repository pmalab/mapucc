trigger LeadTrigger on Lead(after insert,after update) {
    new Triggers()
    	.bind(Triggers.Evt.afterInsert,new SelectLeadPoolHandler())
        .bind(Triggers.Evt.afterUpdate,new SelectLeadPoolHandler())
    	.manage();
}