public with sharing class QuaStudentHandler implements Triggers.Handler{
	public void handle(){
		if(Trigger.isBefore){
	    	List<Student__c> stuList = new List<Student__c>();
	    	for(Student__c stu : (List<Student__c>)Trigger.new){
	    		stu.age__c = 50;

	    		/*if(stu.Name == '19940812'){
	    			Student__c s = new Student__c();
	    			s.Name = 'mapu19940812';
	    			stuList.add(s);
	    		}*/
	    	}
	    	/*if(stuList.size()>0){
	    		INSERT stuList;
	    	}*/

	    }
	}
    
}