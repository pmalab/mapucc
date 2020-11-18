@isTest
private class AccountManagerTest {
    @isTest static void testGetCaseById() {
        Id recordId = createTestRecord();
        // Set up a test request
        RestRequest request = new RestRequest();
       request.requestUri =
            'https://na1.salesforce.com/services/apexrest/Accounts/'+recordId+'/contacts';
        request.httpMethod = 'GET';
        RestContext.request = request;
        // Call the method to test
        Account thisCase = AccountManager.getAccount();
        // Verify results
        System.assert(thisCase != null);
        System.assertEquals('Test record', thisCase.Name);
    }

    static Id createTestRecord() {
        // Create test record
        Account caseTest = new Account(
            Name='Test record',
            Phone='15732029254'
          );
        insert caseTest;

        Contact con = new Contact(
        	LastName='Abby',
            Phone='18305193539',
            AccountId=caseTest.Id
        );

        return caseTest.Id;
    }        
}