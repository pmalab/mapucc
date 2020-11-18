@RestResource(urlMapping='/TestRest')
global class TestRest {
    @HttpGet
    global static String getTestRest() {
    	RestRequest request = RestContext.request;
        String name = request.params.get('name');
    
        return 'Hello '+name;
    }
}