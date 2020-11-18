@isTest
private class StudentTrigger_Test {
    static testMethod void testMethod1() {
        Student__c stu = new Student__c();
        stu.Name = '19940812';
        INSERT stu;
    }
}