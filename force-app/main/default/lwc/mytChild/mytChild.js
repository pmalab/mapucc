import { api, LightningElement, track } from 'lwc';

export default class MytChild extends LightningElement {

    @api
    nameListInParent;

    @track
    cmpName = "mytChild";

    nameListInChild = ['peter', 'mary', 'jack'];

    connectedCallback(){
        console.log("conntectCallBack==>>"+this.cmpName);
    }

    disconnectedCallback(){
        console.log("disconntectCallBack==>>"+this.cmpName);
    }

    renderedCallback(){
        console.log("renderedCallback==>>"+this.cmpName);
    }

    handleRemove(event){
        let parentName = event.target.dataset.name;
        console.log('===='+parentName)
        const selectEvent = new CustomEvent('namechanged', {
            detail: parentName
        });
        this.dispatchEvent(selectEvent);
    }

}