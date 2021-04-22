trigger ClosedOpportunityTrigger on Opportunity (after insert) {
    
    List<Task> taskListToInsert = new List<Task>();
    for(Opportunity opp:Trigger.new)
    {
        if(opp.StageName == 'Closed Won')
        {
            Task t = new Task();
            t.Subject = 'Follow Up Test Task';
            t.WhatId = opp.Id;
            taskListToInsert.add(t);
        }
    }
    
    if(taskListToInsert.size() > 0)
    {
        insert taskListToInsert;
    }

}