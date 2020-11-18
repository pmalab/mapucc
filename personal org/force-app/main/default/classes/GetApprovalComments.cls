/**
 * Created by mapu on 2019/1/19.
 */

public with sharing class GetApprovalComments implements Triggers.Handler{

    public void  handle(){

        main();
    }

    public void main(){

        Set<Id> caseIdSet = new Set<Id>();

        for(Case ca : (List<Case>)Trigger.new){
            Case oldCase = (Case)Trigger.oldMap.get(ca.Id);
            Boolean rejectOld = oldCase.IsReject__c;
            if(ca.IsReject__c == True ){
                caseIdSet.add(ca.Id);

            }

        }

        List<ProcessInstance> instances = [SELECT Id, TargetObjectId, CreatedDate FROM ProcessInstance WHERE TargetObjectId IN: caseIdSet AND Status='Rejected' ORDER BY CreatedDate DESC];
        if(!instances.isEmpty()){
            Map<Id,ProcessInstance> caseProcessMap = new Map<Id,ProcessInstance>();
            Set<Id> instanceSet = new Set<Id>();

            for(ProcessInstance pi : instances){
                if(!caseProcessMap.containsKey(pi.TargetObjectId)){
                    caseProcessMap.put(pi.TargetObjectId,pi);
                    instanceSet.add(pi.Id);
                }else{
                    if(pi.CreatedDate > caseProcessMap.get(pi.TargetObjectId).CreatedDate){
                        caseProcessMap.put(pi.TargetObjectId,pi);
                    }
                }

            }
            //System.debug('-----------------'+caseProcessMap);
            List<ProcessInstanceStep> instanceSteps = [SELECT Comments, ProcessInstanceId, CreatedDate FROM ProcessInstanceStep WHERE ProcessInstanceId IN :instanceSet AND StepStatus='Rejected'];

            Map<Id,String> caseProcessStepMap = new Map<Id,String>();
            for(ProcessInstanceStep pis : instanceSteps){

                caseProcessStepMap.put(pis.ProcessInstanceId,pis.Comments);

            }
           /* Map<Id,ProcessInstanceStep> caseProcessStepMap = new Map<Id,ProcessInstanceStep>();
            for(ProcessInstanceStep pis : instanceSteps){
                if(!caseProcessStepMap.containsKey(pis.ProcessInstanceId)){
                    caseProcessStepMap.put(pis.ProcessInstanceId,pis);
                }else{
                    if(pis.CreatedDate > caseProcessStepMap.get(pis.ProcessInstanceId).CreatedDate){
                        caseProcessStepMap.put(pis.ProcessInstanceId,pis);
                    }
                }
            }*/
           // System.debug('==========='+caseProcessStepMap);
            for(Case ca : (List<Case>)Trigger.new){
                Case oldCase = (Case)Trigger.oldMap.get(ca.Id);
                Boolean rejectOld = oldCase.IsReject__c;
                if(ca.IsReject__c == True ){
                    Ca.Reject_Comments__c = caseProcessStepMap.get(caseProcessMap.get(ca.Id).Id);
                    ca.IsReject__c = false;
                }
            }
        }

    }
}