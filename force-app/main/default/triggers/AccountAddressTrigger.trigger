trigger AccountAddressTrigger on Account(before insert, before update) {
    // for (Account a : Trigger.New) {
    //  if (a.Match_Billing_Address__c && a.BillingPostalCode != null) {
    //   a.BillingPostalCode = a.ShippingPostalCode;
    //  }
    // }

    for (Account acc : Trigger.new) {
        System.debug('in====');
        //如果Account的Active__c字段被修改
        if (acc.Active__c != Trigger.oldMap.get(acc.Id).Active__c) {
            acc.NumberofLocations__c = acc.NumberofLocations__c + 1;
        }
    }
}
