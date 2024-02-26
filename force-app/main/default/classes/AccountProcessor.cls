public class AccountProcessor {
    @future
    public static void countContacts(Set<id> setId) {
        List<Account> lstAccount = [
            SELECT id, Number_of_Contacts__c, (SELECT id FROM contacts)
            FROM account
            WHERE id IN :setId
        ];
        for (Account acc : lstAccount) {
            List<Contact> lstCont = acc.contacts;

            acc.Number_of_Contacts__c = lstCont.size();
        }
        update lstAccount;
    }
}
