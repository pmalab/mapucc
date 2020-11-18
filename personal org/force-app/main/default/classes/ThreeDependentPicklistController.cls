public class ThreeDependentPicklistController {
    @AuraEnabled
    public static Map<String,Map<String,List<String>>> getDependentMap(sObject objDetail, string contrfieldApiName,string contrfieldApiName2,string depfieldApiName) {
        String controllingField = contrfieldApiName.toLowerCase();
        String dependentField = depfieldApiName.toLowerCase();
        System.debug('contrfieldApiName========='+contrfieldApiName);
        System.debug('contrfieldApiName2========='+contrfieldApiName2);
        String controllingField2 = contrfieldApiName2.toLowerCase();
        Map<String,Map<String,List<String>>> objResults = new Map<String,Map<String,List<String>>>();
        
        Schema.sObjectType objType = objDetail.getSObjectType();
        if (objType==null){
            return objResults;
        }
        
        Map<String, Schema.SObjectField> objFieldMap = objType.getDescribe().fields.getMap();
        //System.debug('value===='+objFieldMap.containsKey(controllingField2));
        
        if (!objFieldMap.containsKey(controllingField) || !objFieldMap.containsKey(dependentField) ||!objFieldMap.containsKey(controllingField2)){
        	//System.debug('in======');
            return objResults;     
        }
        
        Schema.SObjectField theField = objFieldMap.get(dependentField);
        Schema.SObjectField ctrlField = objFieldMap.get(controllingField);
        Schema.SObjectField ctrlField2 = objFieldMap.get(controllingField2);
        List<Schema.PicklistEntry> contrEntries = ctrlField.getDescribe().getPicklistValues();
        List<PicklistEntryWrapper> contrEntries2 = wrapPicklistEntries(ctrlField2.getDescribe().getPicklistValues());
        List<PicklistEntryWrapper> depEntries = wrapPicklistEntries(theField.getDescribe().getPicklistValues());

        List<String> controllingValues = new List<String>();
        
        for (Schema.PicklistEntry ple : contrEntries) {
            String label = ple.getLabel();
            objResults.put(label, new Map<String,List<String>>());
            controllingValues.add(label);
        }

        List<String> controllingValues2 = new List<String>();
        Map<String,List<String>> twoRelationMap = new Map<String,List<String>>();
        for (PicklistEntryWrapper ple2 : contrEntries2) {
            String label = ple2.label;
            String validForBits = base64ToBits(ple2.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') {
                    objResults.get(controllingValues.get(i)).put(label,new List<String>());

                }
            }
            controllingValues2.add(label);
            twoRelationMap.put(label, new List<String>());
        }
        
        for (PicklistEntryWrapper plew : depEntries) {
            String label = plew.label;
            String validForBits = base64ToBits(plew.validFor);
            for (Integer i = 0; i < validForBits.length(); i++) {
                String bit = validForBits.mid(i, 1);
                if (bit == '1') {
                    twoRelationMap.get(controllingValues2.get(i)).add(label);
                }
            }
        }
        for (String key : objResults.keySet()) {
        	for(String kk : objResults.get(key).keySet()){
        		if(twoRelationMap.containsKey(kk)){
    				objResults.get(key).put(kk, twoRelationMap.get(kk));
    			}
        	}
        }
        return objResults;
    }
    
    public static String decimalToBinary(Integer val) {
        String bits = '';
        while (val > 0) {
            Integer remainder = Math.mod(val, 2);
            val = Integer.valueOf(Math.floor(val / 2));
            bits = String.valueOf(remainder) + bits;
        }
        return bits;
    }
    
    public static String base64ToBits(String validFor) {
        if (String.isEmpty(validFor)) return '';
        
        String validForBits = '';
        
        for (Integer i = 0; i < validFor.length(); i++) {
            String thisChar = validFor.mid(i, 1);
            Integer val = base64Chars.indexOf(thisChar);
            String bits = decimalToBinary(val).leftPad(6, '0');
            validForBits += bits;
        }
        
        return validForBits;
    }
    
    private static final String base64Chars = '' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
        'abcdefghijklmnopqrstuvwxyz' +
        '0123456789+/';
    
    
    private static List<PicklistEntryWrapper> wrapPicklistEntries(List<Schema.PicklistEntry> PLEs) {
        return (List<PicklistEntryWrapper>)
            JSON.deserialize(JSON.serialize(PLEs), List<PicklistEntryWrapper>.class);
    }
    
    public class PicklistEntryWrapper{
        public String active {get;set;}
        public String defaultValue {get;set;}
        public String label {get;set;}
        public String value {get;set;}
        public String validFor {get;set;}
        public PicklistEntryWrapper(){            
        }
        
    }
}