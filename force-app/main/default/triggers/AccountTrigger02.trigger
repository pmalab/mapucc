trigger AccountTrigger02 on Account(before update) {
    /*//建立一个新的订单对象
    Order ord = new Order();
    for(Account acc : Trigger.new){
        ord.AccountId = acc.Id;
        ord.Name = '订单B';
        //ord.EffectiveDate = date.today();
        //ord.Status = 'Draft';

    }
    insert ord;*/

    // for(Account acc : Trigger.new){
    //     System.debug('in====');
    //     //如果Account的Active__c字段被修改
    //     if(acc.Active__c != Trigger.oldMap.get(acc.Id).Active__c){
    //        acc.NumberofLocations__c = acc.NumberofLocations__c + 1;
    //     }

    // }
}
