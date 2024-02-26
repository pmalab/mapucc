import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';
import getRequest from '@salesforce/apex/AccountController.getRequest';
import submitRequest from '@salesforce/apex/AccountController.submitRequest';
export default class HelloForEach extends LightningElement {
    contacts = [
        {
            Id: '003171931112854375',
            Name: 'Amy Taylor',
            Title: 'COO',
        },
        {
            Id: '003192301009134555',
            Name: 'Michael Jones',
            Title: 'CTO',
        },
        {
            Id: '003848991274589432',
            Name: 'Jennifer Wu',
            Title: 'CEO',
        },
    ];
@track lstResult;
    connectedCallback() {
        this.getRequest();
    }

    getRequest(){
        getRequest().then(result => {
            this.lstResult = result;
        })
        .catch(error => {
            this.error = error;
            this.showSpin = false;
            console.log('ERROR ' + JSON.stringify(error));
        });
    }

    submitRequest(){
        submitRequest({resultWrapper: this.lstResult}).then(result => {
            this.lstResult = result;
        })
        .catch(error => {
            this.error = error;
            this.showSpin = false;
            console.log('ERROR ' + JSON.stringify(error));
        });
    }
}