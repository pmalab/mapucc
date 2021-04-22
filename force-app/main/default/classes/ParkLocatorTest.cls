@isTest
private class ParkLocatorTest {
  
      @isTest static void testCallout() {              
        // This causes a fake response to be generated
        Test.setMock(WebServiceMock.class, new ParkServiceMock());
        // Call the method that invokes a callout
        String  arg0 = 'agr0';
        String[] result = ParkLocator.country(arg0);
        // Verify that a fake result is returned
        System.assertEquals(new String[]{'arg0'}, result); 
    }
}