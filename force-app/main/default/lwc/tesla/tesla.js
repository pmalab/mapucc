import { LightningElement, track } from 'lwc';
export default class Child1 extends LightningElement {
    @track  log = ''; 
    modelClick(e){
        this.log = this.log + ' Captured event - '+ e.detail+' ';
         const event = new CustomEvent('modelclick', {
            // detail contains only primitives
            detail: 'Event Started in Tesla'
        });
        // Fire the event from model 3
        this.dispatchEvent(event);
    }
}