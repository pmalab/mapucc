/*
*sherlock.chen@celnet.com.cn
*2018-01-15
*lightning 组件：SearchAccount apex类
*/
public class SearchAccountController {
    
    // 查询方法
    @AuraEnabled
    public static List<Account> fetchAccount(String searchKey) {
    	String key = '%' + searchKey + '%';
    	List<Account> acc_list = new List<Account>();
        //Account[] acc_list = new Account[]{};
        acc_list = [select Id,Name,Phone,Fax,Type,Industry from Account where Name like: key];
        return acc_list;
    }

    // 初始化方法
    @AuraEnabled
    public static List<Account> loadAccounts(){
    	List<Account> acc_list = new List<Account>();
    	acc_list = [select id,Name,Phone,Type,Industry from Account limit 50];
    	return acc_list;
    }
}