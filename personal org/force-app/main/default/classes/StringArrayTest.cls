public  class StringArrayTest {
    

    public static List<String> generateStringArray(Integer n){
    	List<String> nnList = new List<String>();

    	for(Integer i=0;i<n;i++){
    		String str = 'Test '+i;
    		nnList.add(str);
    	}
    	System.debug('nnList======='+nnList);
    	return nnList;
    }
}