import {
    LightningElement,
    track,
    wire,
    api
} from 'lwc';

import {
    getRecord,
    createRecord,
    deleteRecord,
    updateRecord
} from 'lightning/uiRecordApi';

import { refreshApex } from '@salesforce/apex';

import {
    getObjectInfo
} from 'lightning/uiObjectInfoApi';


import {
    NavigationMixin
} from 'lightning/navigation';

import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

import NAME from '@salesforce/schema/Reimbursement__c.Name';
import RES_ID from '@salesforce/schema/Reimbursement__c.Id';
import TOTAL_MONEY from '@salesforce/schema/Reimbursement__c.totalmoney__c';
import RES_OBJECT from '@salesforce/schema/Reimbursement__c';
import getCases from '@salesforce/apex/CmpCheckResListController.getResDetails';

const fields = [NAME, RES_ID, TOTAL_MONEY];

export default class CheckResList extends NavigationMixin(LightningElement) {
    @api recordID;
    @track recordTypes;
    @track resb;
    @track data;

    @wire(getRecord, { recordId: '$recordID', fields })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading case',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {
            this.resb = data;
            this.totalMoney = this.resb.fields.totalmoney__c.value;
        }
    }

    @wire(getObjectInfo, {
        objectApiName: RES_OBJECT
    }) getobjectInfo(result) {
        if (result.data) {
            const rtis = result.data.recordTypeInfos;
            this.recordTypes = rtis;
        }
    }

    connectedCallback() {
        this.getRelateDetailList();
    }

    getRelateDetailList(){
        this.showSpin = true;
        console.debug(this.recordID);
        getCases({
            recordID: this.recordID
        }).then(result => {
            this.data = JSON.parse(result);
            this.showSpin = false;
        })
        .catch(error => {
            this.error = error;
            this.showSpin = false;
            console.log('ERROR ' + JSON.stringify(error));
        });
    }

    closeModal(){
        this.dispatchEvent(new CustomEvent('closemodal'));
    }

    payRefund(){
        this.showSpin = true;
        console.log(this.data)
        this.showSpin = false;
        // this.dispatchEvent(new CustomEvent('closemodal'));
    }

}