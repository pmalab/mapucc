({
    doInit: function(component, event, helper) {
        debugger;
        var id=component.get("v.recordId");
        
    },
    listenOnCloseEvent : function(component, event, helper) {
        var closeWizard = $A.get("e.force:closeQuickAction");
        closeWizard.fire();
    },
    NavigateTo: function(component, event, helper) {
        var url=event.getParam('urlString');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.openTab({
            url: url,
            focus: true
        });
    },
    OpenSubTab:function(component,event,helper){
        var url=event.getParam('urlString');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.openSubtab({
                url: url,
                focus: true,
                parentTabId:focusedTabId
            });
        })
    },
    CloseCurrentTab:function(component,event,helper){
        debugger;
        var url=event.getParam('urlString');
        var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
            var focusedTabId = response.tabId;
            workspaceAPI.openTab({
                url: url,
                focus: true
            });
            workspaceAPI.closeTab({
                tabId: focusedTabId
            });
        })
    },
})