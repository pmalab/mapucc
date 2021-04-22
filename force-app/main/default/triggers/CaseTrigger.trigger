/**
 * Created by mapu on 2019/1/19.
 */

trigger CaseTrigger on Case (before insert, before update) {

    new Triggers()
            .bind(Triggers.EVT.beforeupdate,new GetApprovalComments())
            .manage();

}