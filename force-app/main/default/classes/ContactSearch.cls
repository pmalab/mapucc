public  class ContactSearch {
    
    public static List<Contact> searchForContacts(String lastName,String postCode){

    	List<Contact> conList = [SELECT ID,NAME 
    							 FROM Contact
    							 WHERE LastName=:lastName AND MailingPostalCode =:postCode];
    	return conList;

    }
}