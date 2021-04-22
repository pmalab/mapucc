global class TotalMoney {
   webservice static String getTotalMoney(Id ReimbursementId){
   		//获取父类Id
   	List<Reimbursement__c> lis = [select Id,Type__c ,Totalmoney__c,num__c from Reimbursement__c where Id =:ReimbursementId];
   	System.debug('---------------------------'+lis);
   	//获取所有子类id
   	List<ReimbursementSelect__c> ziLis = [select Id,ReimbursementId__c,Money__c ,State__c from ReimbursementSelect__c];
	System.debug('Intellij Idea');
	system.debug('');
    //r.num__c = 0;
    //r.totalmoney__c = 0;
   	for(Reimbursement__c r : lis){
   		for(ReimbursementSelect__c rei : ziLis){
   			if(r.Id==rei.ReimbursementId__c){
            //如果费用报销中一个明细都没有，先把总钱数和总明细数设置成0
      			if(r.totalmoney__c==null || r.totalmoney__c ==0){
      				r.totalmoney__c=0;
             		 r.num__c = 0;
      			}
      			if(rei.state__c == false){
      				rei.state__c = true;
      				r.totalmoney__c += rei.money__c;
              r.num__c++ ;
              update rei;
      			}
   			}
   		}
   	}
   	update lis;
   	return '汇总完成';
   }
}