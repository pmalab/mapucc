public with sharing class NewCaseSubController {
	public Case masterCase{set;get;}  
    public NewCaseSubController() {
        String id = ApexPages.currentPage().getParameters().get('id');
        masterCase = new Case();
        masterCase = [SELECT Id,Origin,Reason,AccountId,ContactId,ParentId 
                      FROM Case
                      WHERE ID=:id];

    }
}