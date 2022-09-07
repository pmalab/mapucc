import ApiProperty from 'c/apiProperty';
import { LightningElement, track } from 'lwc';

export default class MytParent extends LightningElement {

    @track
    cmpName = "mytParent";

    @track
    showLifeCycle = true;

    @track
    name = 'world';

    @track
    nameIsExist = true;

    @track
    nameListInParent = [];

    connectedCallback(){
        console.log("conntectCallBack==>>"+this.cmpName);
    }

    disconnectedCallback(){
        console.log("disconntectCallBack==>>"+this.cmpName);
    }

    handleRemove(){
        this.showLifeCycle = false;
    }

    renderedCallback(){
        console.log("renderedCallback==>>"+this.cmpName);
    }

    handleChange(event){
        this.name = event.target.value;
        console.log('data-id', event.target.dataset.id);
        if(!this.name){
            this.nameIsExist = false;
        }
        if(!this.nameIsExist && this.name){
            this.nameIsExist = true;
        }
    }

    get isNameListNotEmpty(){
        return this.nameListInParent.length>0 ? true : false;
    }

    handleAddName(){
        this.nameListInParent.push(this.name);
    }

    handleChildChanged(event){
        let removedName = event.detail;
        // this.nameListInParent.remove(removedName);
        this.nameListInParent = this.nameListInParent.filter(e => e !== removedName)
    }
}