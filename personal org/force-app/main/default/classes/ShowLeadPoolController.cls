/*
	author:马蒲
	date:2018/01/11
	function:潜在客户公海池页面，里面包含领取，未领取，废弃的展示数据，同时可以在此页面进行领取，分配，回收的功能

*/
public with sharing class ShowLeadPoolController {

	//所有公海池List
	public List<LeadPool__c> lpList{get;set;}
	//潜在客户List
	public List<Lead> leadList{get;set;}

	//公海池数据展示List
	public List<InnerLead> innerLeadList{get;set;} 

	//当前公海池id
	public String lpId{get;set;}
	//所选择的公海
	public String lpType {set;get;}
	//公海池名称下拉框
	public List<SelectOption> options{set;get;}

	//未领取
	public Boolean noReceiveFlag{get;set;}
	//已领取
	public Boolean receiveFlag{get;set;}
	//已废弃
	public Boolean abandonFlag{get;set;}



	//领用
	public Boolean obtainFlag{get;set;}

	//分配
	public Boolean signFlag{get;set;}

	//放弃
	public Boolean giveUpFlag{get;set;}

	//回收
	public Boolean recycleFlag{get;set;}

	//恢复
	public Boolean restoreFlag{get;set;}

    public String userJSON{get;set;}

    public String YSLUser{get;set;}//查找功能的输入框
    public List<checkUser> chUserList{get;set;}
    public ShowLeadPoolController() {
        lpList = [SELECT ID,NAME 
        		  FROM LeadPool__c];
        getSpecialList(lpList);
        leadList = new List<Lead>();
        if(lpList.size()>0){
        	lpId = lpList.get(0).id;
        	leadList = [SELECT ID,NAME,BelongLP__c,Company,Status,MobilePhone,Email,Owner.name,PoolState__c
        				FROM Lead
        				WHERE BelongLP__c=:lpId AND PoolState__c=:'未领取'];
        }
        System.debug('leadList===>>'+leadList);
        innerLeadList = new List<InnerLead>();
       if(leadList.size()>0){
       		for(Lead le : leadList){
       			InnerLead il = new InnerLead();
       			il.isSelect = false;
       			il.lea = le;
       			innerLeadList.add(il);
       		}
       }

       noReceiveFlag = true;
       receiveFlag = false;
       abandonFlag = false;

       //判断功能按钮的显示方法
       judgeButtonShow();

       getRecycledUser();
    }

    //更改公海池
    public void changeLeadPool(){
    	lpId = lpType;
    	leadList = [SELECT ID,NAME,BelongLP__c,Company,Status,MobilePhone,Email,Owner.name,PoolState__c
        				FROM Lead
        				WHERE BelongLP__c=:lpId];
        innerLeadList.clear();
        if(leadList.size()>0){
	        if(leadList.size()>0){
	       		for(Lead le : leadList){
	       			InnerLead il = new InnerLead();
	       			il.isSelect = false;
	       			il.lea = le;
	       			innerLeadList.add(il);
	       		}
	       }
        }

        judgeButtonShow();
    }

    //未领取、已领取、已废弃刷新
    public void stateGetPool(){
    	Set<String> stateSet = new Set<String>();
    	if(noReceiveFlag){
    		stateSet.add('未领取');
    	}
    	if(receiveFlag){
    		stateSet.add('已领取');
    	}
    	if(abandonFlag){
    		stateSet.add('已废弃');
    	}
    	String sql = 'SELECT ID,NAME,BelongLP__c,Company,Status,MobilePhone,Email,Owner.name,PoolState__c FROM Lead WHERE BelongLP__c=:lpId AND PoolState__c IN:stateSet';
    	leadList = Database.query(sql);
    	innerLeadList.clear();
        if(leadList.size()>0){
	        if(leadList.size()>0){
	       		for(Lead le : leadList){
	       			InnerLead il = new InnerLead();
	       			il.isSelect = false;
	       			il.lea = le;
	       			innerLeadList.add(il);
	       		}
	       }
        }

        judgeButtonShow();
     
    }

    //领用
    public void personalObatin(){
    	List<Lead> newLeadList = new List<Lead>();
    	List<InnerLead> newLeadListShow = new List<InnerLead>();
    	for(InnerLead il : innerLeadList){
    		System.debug('il.isSelect=====>>'+il.isSelect);
    		if(il.isSelect){

    			Lead le = new Lead();
    			le = il.lea;
    			le.PoolState__c = '已领取';
    			newLeadList.add(le);
    		}else{
    			newLeadListShow.add(il);
    		}
    	}
    	System.debug('newLeadList=====>>'+newLeadList);
    	if(newLeadList.size()>0){
    		try{
	    		//更新潜在状态
				UPDATE newLeadList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
	    	}			
    	}

    	innerLeadList = newLeadListShow;
    }
     //分配
    public void signObatin(){
    	List<Lead> newLeadList = new List<Lead>();
    	List<InnerLead> newLeadListShow = new List<InnerLead>();
    	for(InnerLead il : innerLeadList){
    		System.debug('il.isSelect=====>>'+il.isSelect);
    		if(il.isSelect){

    			Lead le = new Lead();
    			le = il.lea;
    			le.PoolState__c = '已领取';
    			newLeadList.add(le);
    		}else{
    			newLeadListShow.add(il);
    		}
    	}
    	System.debug('newLeadList=====>>'+newLeadList);
    	if(newLeadList.size()>0){
    		try{
	    		//更新潜在状态
				UPDATE newLeadList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
	    	}			
    	}

    	innerLeadList = newLeadListShow;
    }
     //废弃
    public void adminAbandon(){
    	List<Lead> newLeadList = new List<Lead>();
    	List<InnerLead> newLeadListShow = new List<InnerLead>();
    	for(InnerLead il : innerLeadList){
    		System.debug('il.isSelect=====>>'+il.isSelect);
    		if(il.isSelect){

    			Lead le = new Lead();
    			le = il.lea;
    			le.PoolState__c = '已废弃';
    			newLeadList.add(le);
    		}else{
    			newLeadListShow.add(il);
    		}
    	}
    	System.debug('newLeadList=====>>'+newLeadList);
    	if(newLeadList.size()>0){
    		try{
	    		//更新潜在状态
				UPDATE newLeadList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
	    	}			
    	}

    	innerLeadList = newLeadListShow;
    }

     //回收
    public void recycleLead(){
    	List<Lead> newLeadList = new List<Lead>();
    	List<InnerLead> newLeadListShow = new List<InnerLead>();
    	for(InnerLead il : innerLeadList){
    		System.debug('il.isSelect=====>>'+il.isSelect);
    		if(il.isSelect){

    			Lead le = new Lead();
    			le = il.lea;
    			le.PoolState__c = '未领取';
    			newLeadList.add(le);
    		}else{
    			newLeadListShow.add(il);
    		}
    	}
    	System.debug('newLeadList=====>>'+newLeadList);
    	if(newLeadList.size()>0){
    		try{
	    		//更新潜在状态
				UPDATE newLeadList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
	    	}			
    	}

    	innerLeadList = newLeadListShow;
    }

     //恢复
    public void restoreLead(){
    	List<Lead> newLeadList = new List<Lead>();
    	List<InnerLead> newLeadListShow = new List<InnerLead>();
    	for(InnerLead il : innerLeadList){
    		System.debug('il.isSelect=====>>'+il.isSelect);
    		if(il.isSelect){

    			Lead le = new Lead();
    			le = il.lea;
    			le.PoolState__c = '未领取';
    			newLeadList.add(le);
    		}else{
    			newLeadListShow.add(il);
    		}
    	}
    	System.debug('newLeadList=====>>'+newLeadList);
    	if(newLeadList.size()>0){
    		try{
	    		//更新潜在状态
				UPDATE newLeadList;
	    	}catch(Exception e){
	    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
	    	}			
    	}

    	innerLeadList = newLeadListShow;
    }
    public PageReference doSave(){
    	return null;
    }

    public PageReference doCancel(){
    	return null;
    }


    //得到公海池名称下拉框
    public void  getSpecialList(List<LeadPool__c> lpList){
      options = new List<SelectOption>();
        
      if(lpList.size()>0){
        //Set<String> speSet = new Set<String>();
        Map<String,String> speMap = new Map<String,String>();
          for(LeadPool__c lp : lpList){
            //speSet.add(lp.name);
            speMap.put(lp.Id, lp.Name);
          }
       /* for(String spe : speSet){       
          options.add(new SelectOption(spe,spe));
        }*/
        for(String key : speMap.keySet()){
        	options.add(new SelectOption(key,speMap.get(key)));
        }
      }
      

    }

    //判断功能按钮的显示
    public void judgeButtonShow(){
  
       obtainFlag = false;
       signFlag = false;
       giveUpFlag = false;
       recycleFlag = false;
       restoreFlag = false;
       if(noReceiveFlag == true && receiveFlag == false && abandonFlag == false){
       		obtainFlag = true;
       		signFlag = true;
       		giveUpFlag = true;
       }

       if(receiveFlag == true && noReceiveFlag == false && abandonFlag == false){
       		recycleFlag = true;
       }

       if(abandonFlag == true && noReceiveFlag==false && receiveFlag==false){
       		restoreFlag = true;
       }


    }

      //弹出页面的查找用户功能
      public void seachYSLUser()
    {
        chUserList.clear();
        YSLUser = Apexpages.currentPage().getParameters().get('YSLUser');
        String sql = 'select Id,Name from User where Name like \'%'+YSLUser+'%\' and IsActive = true';
        List<User> sUserList = new List<User>();
        sUserList = Database.query(sql);
        if(sUserList.size() > 0)
        {
            for(User u : sUserList)
            {
                checkUser chUser = new checkUser();
                chUser.cusService = new User();
                chUser.checkbox = false;
                chUser.cusService = u;
                chUserList.add(chUser);
            }
        }
    }

     //获取所有客服人员
      public void getRecycledUser()
    {
        chUserList = new List<checkUser>();
        List<User> userList = new List<User>([select Id,Name from User where IsActive = true]);
        for(User u : userList)
        {
            checkUser chUser = new checkUser();
            chUser.cusService = new User();
            chUser.checkbox = false;
            chUser.cusService = u;
            chUserList.add(chUser);
        }
        userJSON = JSON.serialize(chUserList);
    }

     //将被选中的用户赋进被分派人/被回收人的列表中
    public void getDispatchTable()
    {

        String dowhat = Apexpages.currentPage().getParameters().get('dowhat');
        String uids = Apexpages.currentPage().getParameters().get('uids');

        System.debug('dowhat=======>>>'+dowhat);
        System.debug('uids=======>>>'+uids);
        if(uids.contains('on,'))
        {
            uids = uids.replace('on,','');
        }
        uids = '\'' +uids.replace(',','\',\'') +'\'';
        List<User> uList = new List<User>();
        String sql = 'select Id,Name from User where  IsActive = true and Id IN ('+uids+')';
        System.debug('0909090909'+sql);
        uList = Database.Query(sql);

        if(uList.size()>0 ){
            List<Lead> newLeadList = new List<Lead>();
            List<InnerLead> newLeadListShow = new List<InnerLead>();
            for(InnerLead il : innerLeadList){
                System.debug('il.isSelect=====>>'+il.isSelect);
                if(il.isSelect){

                    Lead le = new Lead();
                    le = il.lea;
                    le.PoolState__c = '已领取';
                    le.OwnerId = uList.get(0).id;
                    newLeadList.add(le);
                }else{
                    newLeadListShow.add(il);
                }
            }
            System.debug('newLeadList=====>>'+newLeadList);
            if(newLeadList.size()>0){
                try{
                    //更新潜在状态
                    UPDATE newLeadList;
                }catch(Exception e){
                    apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
                }           
            }

            innerLeadList = newLeadListShow;
        }
        
    }


     public void getDispatchTable02()
    {

        String uids = Apexpages.currentPage().getParameters().get('userId');

        System.debug('uids=======>>>'+uids);
        List<User> uList = new List<User>();
        String sql = 'select Id,Name from User where  IsActive = true and Id IN (\''+uids+'\')';
        System.debug('sql==============='+sql);
        System.debug('0909090909'+sql);
        uList = Database.Query(sql);

        if(uList.size()>0 ){
            List<Lead> newLeadList = new List<Lead>();
            List<InnerLead> newLeadListShow = new List<InnerLead>();
            for(InnerLead il : innerLeadList){
                System.debug('il.isSelect=====>>'+il.isSelect);
                if(il.isSelect){

                    Lead le = new Lead();
                    le = il.lea;
                    le.PoolState__c = '已领取';
                    le.OwnerId = uList.get(0).id;
                    newLeadList.add(le);
                }else{
                    newLeadListShow.add(il);
                }
            }
            System.debug('newLeadList=====>>'+newLeadList);
            if(newLeadList.size()>0){
                try{
                    //更新潜在状态
                    UPDATE newLeadList;
                }catch(Exception e){
                    apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'更新出错'));
                }           
            }

            innerLeadList = newLeadListShow;
        }
        
    }
    public class InnerLead{
    	public Boolean isSelect{get;set;}
    	public Lead lea{get;set;}
    }

    //添加消费者弹出页用户的内部类
      public class checkUser
    {
        public boolean checkbox{get;set;}
        public User cusService{get;set;}
    }
}