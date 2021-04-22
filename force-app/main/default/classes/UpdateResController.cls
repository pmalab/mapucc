global  class UpdateResController {
   webservice static boolean choose(Id ReimbursementId)	{
   		Boolean flag = false;
   		List<Reimbursement__c> lis = [select Id,Type__c from Reimbursement__c where Id =:ReimbursementId];
   		for(Reimbursement__c rei : lis)	{
   			if(rei.type__c!=null){
   				flag = true;

   			}
   		}
   		//update lis;
   		return flag;
   	}
}