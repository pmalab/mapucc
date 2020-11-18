public class ReimbursementSelectHandler implements Triggers.Handler{
    
  
    public void Handle(){
    if(Trigger.isAfter && Trigger.isInsert){
  
    	 //保存费用报销id
    Set<Id> sid = new Set<Id>();
    for(ReimbursementSelect__c rs : (List<ReimbursementSelect__c>)Trigger.new){
        sid.add(rs.ReimbursementId__c);
    }

    //查询费用报销的所有记录
    //Totalmoney__c是汇总，Num是明细个数
    List<Reimbursement__c> reList = [Select id,totalmoney__c,num__c,(Select id,money__c from ReimbursementId__r) 
    from Reimbursement__c where id IN: sid];

    //先循环费用报销记录
    for(Reimbursement__c r : reList)    {
       //再 循环费用报销明细记录
        for(ReimbursementSelect__c rs : r.ReimbursementId__r){
            if(r.totalmoney__c==null){
                r.totalmoney__c=0;
            }
            if(r.num__c==null){
                r.num__c=0;
            }
            r.totalmoney__c = r.totalmoney__c + rs.money__c;
            r.num__c++;
        }
      

        }
        update reList;
    } 
    
  }
    
}