trigger StudentTrigger on Student__c(before insert) {
	//new Triggers().bind(Triggers.Evt.beforeInsert,new QuaStudentHandler()).manage();
    new Triggers().bind(Triggers.Evt.beforeInsert,new QuaStudentHandler()).manage();
}