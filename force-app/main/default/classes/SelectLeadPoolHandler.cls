/*
	Author:马蒲
	Date:2018/01/24
	function:新建潜在客户选择公海池时，如果公海池是不允许不在公海池内的人选择该公海池，此时如果创建人不是公海池成员，不允许选择该公海池
*/

public with sharing class SelectLeadPoolHandler implements Triggers.Handler {

    public void handle() {

    	Set<ID> poolSet = new Set<ID>();
    	Set<ID> userSet = new Set<ID>();
    	Map<String,String> poUsMap = new Map<String,String>();
    	for(Lead l : (List<Lead>)Trigger.new){
    		if(Trigger.isInsert){
    			poolSet.add(l.BelongLP__c);
    			userSet.add(L.CreatedById);
    		}
    		System.debug('trigger.isUpdate=========='+Trigger.isUpdate);
    		if(Trigger.isUpdate){
    			Lead oldl = (Lead)Trigger.oldMap.get(l.Id);
	    		if(oldl.BelongLP__c != l.BelongLP__c){
	    			poolSet.add(l.BelongLP__c);
	    			userSet.add(L.CreatedById);    
	    		}
    		}  		

    	}
        if(poolSet.size()>0){

	    	List<LeadPool__c> leadPoolList = new List<LeadPool__c>();
	    	leadPoolList = [SELECT ID,NAME,AllowEnterData__c,(SELECT ID,NAME,LeadPool__c,User__c FROM LPU_LeadPool__r)
	    					FROM LeadPool__c 
	    					WHERE ID IN: poolSet];
	    	for(Lead l : (List<Lead>)Trigger.new){
	    		for(LeadPool__c lp : leadPoolList){
	    			if(l.BelongLP__c == lp.Id){
	    				if(lp.AllowEnterData__c == false){
	    					Boolean flag = false;
	    					for(LeadPoolUser__c lpu : lp.LPU_LeadPool__r){
	    						System.debug('l.CreatedById==='+l.CreatedById);
	    						System.debug('lpu.User__c==='+lpu.User__c);
	    						System.debug('==='+lpu.User__c.equals(l.CreatedById));
	    						if(l.CreatedById == lpu.User__c ){
	    							flag = true;
	    						}
	    					}
	    					if(flag == false){
	    						l.addError('您不是该公海池的成员，该公海池不允许非该公海池的人员进行选择！');
	    					}
	    				}
	    			}
	    		}
	    		
	    	}
        }

    }
}