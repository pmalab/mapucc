/*
	date:2017/06/25
	author:John
	function:根据条件去添加对应的费用报销明细，不同的条件所显示的需要添加的字段是不同的
*/
public with sharing class BatchAddResRetailController {

	//费用报销明细
	public  List<ReimbursementSelect__c> retailList{set;get;}
	//费用报销id
	public String reId{set;get;}

	//费用报销  
	public ReimbursementSelect__c tail{set;get;}
    public BatchAddResRetailController() {
    	 reId = ApexPages.CurrentPage().getParameters().get('id');
    	 tail = new ReimbursementSelect__c();
    }

    public void AddRetail(){
    	if(retailList == Null){
    		retailList = new List<ReimbursementSelect__c>();
    	}
    	ReimbursementSelect__c rs = new ReimbursementSelect__c();
    	rs.ReimbursementId__c = reId;
    	System.debug('------------------费用报销id-->>>'+rs.ReimbursementId__c);
    	retailList.add(rs);
    }

    public PageReference save(){
    	if(retailList.size()>0){
    		INSERT retailList;
    	}else{
    		ApexPages.addMessage(new ApexPages.Message(ApexPages.Severity.Error,'请添加报销明细！'));
    	}
    	return new PageReference('/'+reId);
    }
    
    //取消
    public PageReference doCancel(){
    	
    	return new PageReference('/'+reId);
    }
}