/*
*sherlock.chen@celnet.com.cn
*2018-01-28
*Test for AccountListDMLController
*/
@isTest
private class AccountListDMLController_Test {
    static testMethod void testMethod1() {
    	// 客户
    	Account acc = new Account();
    	acc.Name = 'chen';
    	insert acc;

    	AccountListDMLController.AccountInner inn = new AccountListDMLController.AccountInner();
        List<AccountListDMLController.AccountInner> init_list = AccountListDMLController.loadAccounts();

        String jsons = JSON.serialize(init_list);
        AccountListDMLController.saveAccount(jsons);

        AccountListDMLController.deleteAccount(jsons);
    }
}