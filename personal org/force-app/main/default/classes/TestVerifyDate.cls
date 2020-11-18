@isTest private class TestVerifyDate {
    @isTest private static void testWithinThirtyDays(){
        Date tomorrow = Date.today().addDays(1);
        Date result = VerifyDate.CheckDates(Date.today(),tomorrow);
        system.assertEquals(tomorrow, result);
    }  

    @isTest private static void testNotWithinThirtyDays(){
        Date nextMonth = Date.today().addDays(31);
        Date result = VerifyDate.CheckDates(Date.today(),nextMonth);
        system.assertNotEquals(nextMonth, result);
    }  
}