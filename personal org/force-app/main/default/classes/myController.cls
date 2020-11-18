public class myController{
    public String myString;
    public Double aa;
    Account[]acctList=new List<Account>{new Account()};
    public String getMystring() {
        return 'getMystring';
    }
    public String getStringMethod1() {
        System.debug('myString:'+myString);
        return myString;
    }
    public String getStringMethod2() {
        if(myString==null)
            myString = 'method2';
        return myString;
    }
}