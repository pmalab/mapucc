/*
	author:John
	date:2017-03-02
	function:根据仓库的分类，选择仓库，保存到仓库产品
*/
public without sharing class ChooseHomeController {

	public String pr_id{set;get;}
	//定义在页面进行选择
	public Home__c ho{set;get;}
	public List<Home__c> hoList{set;get;}
	//public List<ProductHome__c> prhoList{set;get;}
	public List<InnerClass> listInnerClass{set;get;}
	public ChooseHomeController(){
		pr_id = apexPages.currentPage().getParameters().get('id');
		ho = new Home__c();
		hoList = new List<Home__c>();
		listInnerClass = new List<InnerClass>();
		//prhoList = new List<ProductHome__c>();

	}
	
    public class InnerClass{
    	//显示在页面
    	public Home__c iho{set;get;}
    	public Boolean isSelect{set;get;}
    	public ProductHome__c ph{set;get;}
    }

    //查询数据

    public void initData(){
    	String sql = 'Select id,name,BigSort__c,SmallSort__c from Home__c where id != null';
    	if(ho.BigSort__c != null){
    		sql += ' and BigSort__c = \''+ho.BigSort__c+'\'';
    	}
    	if(ho.SmallSort__c!=null){
    		sql += ' and SmallSort__c = \'' + ho.SmallSort__c + '\'';
    	}
        hoList = Database.query(sql);
        initPageData();

    }

    //把数据放到listInnerClass中
    public void initPageData(){
    	listInnerClass.clear();
    	if(hoList.size()>0){
    		for(Home__c ho : hoList){
    			InnerClass ic = new InnerClass();
    			ic.ph = new ProductHome__c();
                ic.isSelect = false;
    			ic.iho = ho;
    			listInnerClass.add(ic);
    		}
    	}
    	
    }


    //保存仓库产品
    public PageReference doSave(){
    	List<ProductHome__c> prhoList = new List<ProductHome__c>();
    	for(InnerClass ic : listInnerClass){
    		if(ic.isSelect){
    			if(ic.ph.date__c == null){
    				apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'日期必填！'));
    				return null;
    			}
    			ProductHome__c pro = new ProductHome__c();
    			pro.date__c = ic.ph.date__c;
    			pro.HoPr__c = ic.iho.Id;
    			pro.PrHo__c = pr_id;
    			prhoList.add(pro);
    		}
    	}
    	if(prhoList.size()==0){
    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'请至少选择一条记录！'));
    		return null;
    	}
    	try{
    		insert prhoList;
    	}catch(Exception e){
    		apexPages.addMessage(new ApexPages.Message(ApexPages.Severity.ERROR,'保存出错'));
    	}

    	return new PageReference('/'+pr_id);
    }

    //取消
    public PageReference doCancel(){
    	
    	return new PageReference('/'+pr_id);
    }
}