/*
	author:马蒲
	date:2018/01/11
	function:批量添加潜在客户公海池成员
*/
public without sharing class AddPoolUserController {

	//用户
	public List<User> userList{get;set;}
	//用户组成的内部类List
	public List<InnerUser> innerUserList{get;set;}
	//用户内部类
	//public InnerUser iu{get;set;}
	//公海池成员
	public List<LeadPoolUser__c> lpuList{get;set;}
	//公海池的ID
	public String lpId{get;set;}

	//已存在的成员id
	public Set<ID> userIdSet{get;set;}
    public AddPoolUserController() {
        //查询到符合条件的用户
        userList = [SELECT ID,NAME,Department,Title,MobilePhone,Email
        			FROM User
        			WHERE IsActive=:true];
        
        innerUserList = new List<InnerUser>();

        lpId = ApexPages.currentPage().getParameters().get('id');
        //根据公海池id去查询该公海池下的成员
        lpuList = new List<LeadPoolUser__c>();
        lpuList = [SELECT ID,NAME,User__c
        		   FROM LeadPoolUser__c
        		   WHERE LeadPool__c =: lpId];
        userIdSet = new Set<ID>();

         //给内部类赋值
        for(User u : userList){   
    		InnerUser iu = new InnerUser();
    		iu.isSelect = false;
    		iu.use = u;
    		innerUserList.add(iu);
    	}
    	//进行判断
       	if(lpuList.size()>0){
       		for(User u : userList){
	        	for(LeadPoolUser__c lpu : lpuList){
	        		if(u.Id == lpu.User__c){
	        			userIdSet.add(u.Id);
	        		}
	        	}
	        }
	        if(userIdSet.size()>0){
	        	for(String userId : userIdSet){
	        		for(InnerUser iu : innerUserList){
	        			if(userId == iu.use.Id){
	        				iu.isSelect = true;
	        			}
	        		}
	        	}
	        }
       	}
       
        
        
    }

    //内部类
    public class InnerUser{
    	public Boolean isSelect{get;set;}
    	public User use{get;set;}
    }

    public PageReference doSave(){
    	List<LeadPoolUser__c> newLpuList = new List<LeadPoolUser__c>();
		System.debug('==='+innerUserList);
		for(InnerUser iu : innerUserList){
			if(iu.isSelect){
				LeadPoolUser__c lpu = new LeadPoolUser__c();
				lpu.User__c = iu.use.Id;
				lpu.LeadPool__c = lpId;
				newLpuList.add(lpu);
			}

		}
		if(newLpuList.size()>0){
			//首先删掉之前的公海池成员
			if(lpuList.size()>0){
				DELETE lpuList;
			}
			try{
	    		//再重新添加
				INSERT newLpuList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'保存出错'));
	    	}			
			
		}else{
			apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'对不起，您还没有选择成员！'));
			return null;
		}

    	return new PageReference('/'+lpId);
    }

    public PageReference doCancel(){
    	return new PageReference('/'+lpId);
    }
}