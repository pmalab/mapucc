/*
	author:John
	date:2018/9/10
	function:show <actionsupport> tag functions
*/
public with sharing class HelloWorldController {

	public String selectedAccountId{GET;SET;}

	public List<SelectOption> Accounts{set;get;}

	public List<SelectOption> listContactItems{set;get;}

	public String result{
		set{result='HelloWorld';}
		get;
	}
    public HelloWorldController() {
    	Accounts = new List<SelectOption>();
    	listContactItems = new List<SelectOption>();
    	setValue();
       
    }

    public void searchContactsByAccountId(){
    	setValue();
    }

    public void setValue(){

    	List<Account> accList = new List<Account>();

    	if(selectedAccountId == null){
    		accList = [SELECT ID,NAME,(SELECT ID,NAME,AccountId FROM Contacts) FROM Account];
    	}else{
    		accList = [SELECT ID,NAME,(SELECT ID,NAME,AccountId FROM Contacts) FROM Account WHERE Id=:selectedAccountId];
    	}
      if(accList.size()>0){

      	  List<Account> realAccList = new List<Account>();

         	for(Account acc : accList){
         		if(acc.Contacts != null && !acc.Contacts.isEmpty()){
         			realAccList.add(acc);
         		}
         	}
         	for(Account acc : realAccList){
         		System.debug('acc.Contacts===>>>'+acc.Contacts);
         	}
          
          listContactItems.clear();
         	for(Account acc : realAccList){
         		Accounts.add(new SelectOption(acc.Id,acc.Name));
         		for(Contact con : acc.Contacts){
         			listContactItems.add(new SelectOption(con.Id,con.Name));
         		}
         	}
      }
    }
}