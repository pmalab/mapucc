public  class AccountHandler {
    

    public static Account insertNewAccount(String name){

    	Account acc = new Account();
    	acc.Name = name;
    	acc.Phone = '15732029254';

        

    	try{

    		INSERT acc;
    		return acc;
    	}catch(Exception e){
    		return null;
    	}

    }
}