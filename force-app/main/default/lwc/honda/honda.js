import { LightningElement, track,api } from 'lwc';
import pubsub from 'c/pubsub' ; 
export default class Honda extends LightningElement {
    @track data; 
    eventFiredCallback;
    eventFired(event){ 
        this.data=event  ;   
    }
    connectedCallback(){
        this.data='callback' ; 
        this.eventFiredCallback = this.eventFired.bind(this); 
        this.register();
    }
    @api
    register(){
        this.data+=' - register' ;
        pubsub.register('uniqueEventId', this.eventFiredCallback ); 
    } 
}