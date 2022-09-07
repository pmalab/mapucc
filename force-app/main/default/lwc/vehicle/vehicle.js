import { LightningElement, track } from 'lwc';
import pubsub from 'c/pubsub' ; 
export default class Container extends LightningElement {
    @track log = '';  
    captEvent(evt){
        this.log = this.log+' '+evt.detail;
        pubsub.fire('uniqueEventId', evt.detail);
    }
}