public with sharing class UpdateSelectController {
	Id reiId = apexPages.currentPage().getParameters().get('id');
    public List<ReimbursementSelect__c> seList {get;set;}

    public List<Account> accList{get;set;}

    public Account acc{get;set;}
    public UpdateSelectController(ApexPages.StandardController controller)
    {
    	seList = [select id,name,money__c from ReimbursementSelect__c where ReimbursementId__c =:reiId];
        accList = [SELECT ID,NAME FROM Account Where id =:'0016F00001w1UnZ'];

        acc = accList[0];
        System.debug('acc==========>>>'+acc);
    }



    //查询该费用对应的所有明细
    public  PageReference queryRei(){
    	
    	return new PageReference('/'+reiId);
    }

    //保存方法
    public PageReference doSave()	{
    	update seList;
    	return new PageReference('/'+reiId);
    }

    //取消方法
    public PageReference doCancel(){
    	return new PageReference('/'+reiId);
    }

}