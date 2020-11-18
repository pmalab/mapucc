/*
	acthor:John
	date:2018/01/15
	function:测试查找框的重写

*/
public without sharing class TestController02 {
    public List<Account> accList{get;set;}
    public String searchString{get;set;}
    public String remindStr {get;set;}
    public Opportunity opp{get;set;}
    public String FormTag{get;set;}
    public String TextBox{get;set;}
    public TestController02() {
        accList = new List<Account>();
        FormTag = getFormTag();
        TextBox = getTextBox();
        System.debug('FormTag====>>>'+FormTag);
         System.debug('TextBox====>>>'+TextBox);
        //opp = [SELECT ID,NAME,Account.Owned_Company__c FROM Opportunity WHERE id=:'0066F00000oXhbQ'];
    }
    public void Search(){

    	if(searchString != null && searchString != ''){
    		String cons = '%' + searchString + '%';
    		 accList = [Select Id,Name from Account where Name Like: cons];
    	}else{
    		 accList = [Select Id,Name from Account];
    	}
       

    }
    // used by the visualforce page to send the link to the right dom element
      public string getFormTag() {      
        return System.currentPageReference().getParameters().get('frm');
      }

      // used by the visualforce page to send the link to the right dom element for the text box
      public string getTextBox() {      
        return System.currentPageReference().getParameters().get('txt');
      }
}