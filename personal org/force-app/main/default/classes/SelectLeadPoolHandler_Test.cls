@isTest
private class SelectLeadPoolHandler_Test {
    static testMethod void testMethod1() {
    	Profile saleProfile = [ select id from Profile where Name = '系统管理员'];
		List<User> userList = [select id,ProfileId,Alias,TimeZoneSidKey,LocaleSidKey,
		LanguageLocaleKey,EmailEncodingKey from User where id =:UserInfo.getUserId()];

		User u = new User();
		u.Username='supUser@123.com';
		u.LastName='supUser';
		u.Email='supUser@123.com';
		u.Alias=userList[0].Alias;
		u.TimeZoneSidKey=userList[0].TimeZoneSidKey;
		u.ProfileId=saleProfile.Id;//简档
		u.LocaleSidKey=userList[0].LocaleSidKey;
		u.LanguageLocaleKey=userList[0].LanguageLocaleKey;
		u.EmailEncodingKey=userList[0].EmailEncodingKey;
		u.CommunityNickname='supUser';
		insert u;


    	//潜在客户公海池
    	LeadPool__c lp = new LeadPool__c();
        lp.Name = '潜在客户公海池';
        insert lp;

        //潜在客户公海池2
    	LeadPool__c lp2 = new LeadPool__c();
        lp2.Name = '潜在客户公海池2';
        insert lp2;

    	//潜在客户公海池成员
    	LeadPoolUser__c llp = new LeadPoolUser__c();
    	llp.User__c = UserInfo.getUserId();
    	llp.LeadPool__c = lp.Id;
    	INSERT llp;

    	//潜在客户公海池成员2
    	LeadPoolUser__c llp2 = new LeadPoolUser__c();
    	llp2.User__c = UserInfo.getUserId();
    	llp2.LeadPool__c = lp2.Id;
    	INSERT llp2;

    	//潜在客户
    	Lead l = new Lead();
    	l.Company = 'company';
    	l.LastName = 'john';
    	//l.Name = '潜在客户';
    	l.BelongLP__c = lp.id;
    	insert l;
    	try{
    		
    	}catch(Exception e){

    	}
    	

    	l.BelongLP__c = lp2.Id;
    	UPDATE l;


        
    }
}