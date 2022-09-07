import { LightningElement, track } from 'lwc';
export default class Model3 extends LightningElement {
    @track  log = '';
    customClick() {
        const event = new CustomEvent('modelclick', {
            // detail contains only primitives
            detail: 'Event Started in Tesla Model 3'
        });
        // Fire the event from model 3
        this.dispatchEvent(event);
        this.log = ' - Model 3 clicked';
    }
}