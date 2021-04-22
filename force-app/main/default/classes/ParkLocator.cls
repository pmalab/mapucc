public with sharing class ParkLocator {
     public static String[] country(String arg0) {
        ParkService.ParksImplPort pp = 
            new ParkService.ParksImplPort();
        return pp.byCountry(arg0);
    }
}