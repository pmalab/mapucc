/*
	作者：马蒲
	时间：2016-02-22
	功能：在添加一个产品之后，添加对应的仓库产品
*/
trigger ProductTrigger on Product__c(after insert) {
    
    //得到所有仓库
    List<Home__c> homList = [Select Id,name from Home__c];
    
    //添加对应的仓库产品
    List<ProductHome__c> phList = new List<ProductHome__c>();
    for(Product__c pro : Trigger.new){
    	for(Home__c ho : homList){
    		ProductHome__c ph = new ProductHome__c();
    		ph.HoPr__c = ho.Id;
    		ph.PrHo__c = pro.Id;
    		phList.add(ph);
    	}
    	//proSet.add(pro.Id);
    }

    insert phList;
   
}