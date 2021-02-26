/**********************************************************************
 * 
 *
 * @url: /services/apexrest/rest
 * @data:
 *  {
        
    }
*************************************************************************/
@RestResource(urlMapping='/Accounts/*/contacts')
global with sharing class AccountManager {
 

    @HttpGet
    global static List<Account> getAccount() {
        RestRequest request = RestContext.request;
        // grab the caseId from the end of the URL
        /*String caseId = request.requestURI.substring(
          request.requestURI.lastIndexOf('/')+1);*/
        String accId = request.requestURI.substringBetween('Accounts/', '/contacts');
        List<Account> accList =  [SELECT ID,NAME,(SELECT ID,NAME FROM Contacts)
                        FROM Account
                        WHERE Id = :accId];
        // System.debug('==>>'+accList);
        System.debug('==>>'+accList.size());
        return accList;
    }
}