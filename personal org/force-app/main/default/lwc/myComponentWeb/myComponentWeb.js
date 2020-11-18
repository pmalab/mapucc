import { LightningElement } from 'lwc';

export default class MyComponentWeb extends LightningElement {
    connectedCallback(){
        this.dispatchEvent(
            // Default values for bubbles and composed are false.
            new CustomEvent('notify')
        );
    }
}