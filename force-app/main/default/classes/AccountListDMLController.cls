/*
*sherlock.chen@celnet.com.cn
*2018-01-28
*AccountListDML 后台类
*/
public class AccountListDMLController {

	public class AccountInner{
		// @AuraEnabled
		// public Account acc{get;set;}
		@AuraEnabled
		public Boolean checkbox{get;set;}
		@AuraEnabled
		public String Id{get;set;}
		@AuraEnabled
		public String Name{get;set;}
		@AuraEnabled
		public String Phone{get;set;}
		@AuraEnabled
		public String AccountSource{get;set;}
	}
	// 初始化加载数据
    @AuraEnabled
    public static List<AccountInner> loadAccounts() {
        // 定义返回值
        List<AccountInner> inner_list = new List<AccountInner>();

        List<Account> acc_lit = new List<Account>();
        acc_lit = [select Id,Name,Phone,AccountSource from Account limit 50];
        if(acc_lit.size() > 0){
        	for(Account acc : acc_lit){
        		AccountInner aci = new AccountInner();
        		aci.checkbox = false;
        		aci.Id = acc.Id;
        		aci.Name = acc.Name;
        		aci.Phone = acc.Phone;
        		aci.AccountSource = acc.AccountSource;
        		inner_list.add(aci);
        	}
        }
        return inner_list;
    }
    // 保存客户
    @AuraEnabled
    public static void saveAccount(String jsons){
    	List<Account> save_list = new List<Account>();
    	List<AccountInner> aci_list = (List<AccountInner>)JSON.deserialize(EncodingUtil.urlDecode(jsons,'utf-8'),List<AccountInner>.class);
    	// system.debug('aaaaaaaaa' + aci_list);
    	for(AccountInner aci : aci_list){
    		Account acc = new Account();
    		acc.Id = aci.Id;
    		acc.Name = aci.Name;
    		acc.Phone = aci.Phone;
    		acc.AccountSource = aci.AccountSource;
    		save_list.add(acc);
    	}
    	if(save_list.size() > 0){
    		upsert save_list;	
    	}
    }
    // 删除客户
    @AuraEnabled
    public static void deleteAccount(String jsons){
    	Set<String> delId_set = new Set<String>();
    	List<AccountInner> aci_list = (List<AccountInner>)JSON.deserialize(EncodingUtil.urlDecode(jsons,'utf-8'),List<AccountInner>.class);
    	for(AccountInner aci : aci_list){
    		if(aci.Id != null){
    			delId_set.add(aci.id);
    		}
    	}
    	if(delId_set.size() > 0){
    		delete [select id from Account where id in: delId_set];
    	}
    }
}