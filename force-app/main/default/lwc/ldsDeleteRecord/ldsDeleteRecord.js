import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { deleteRecord } from 'lightning/uiRecordApi';
import getAccountList from '@salesforce/apex/AccountController.getAccountList';
import { reduceErrors } from 'c/ldsUtils';
import { registerListener, unregisterAllListeners } from 'c/pubsub';
import { CurrentPageReference } from 'lightning/navigation';

export default class LdsDeleteRecord extends LightningElement {
    accounts;
    error;

    /** Wired Apex result so it can be refreshed programmatically */
    wiredAccountsResult;

    @wire(getAccountList)
    wiredAccounts(result) {
        this.wiredAccountsResult = result;
        if (result.data) {
            this.accounts = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.accounts = undefined;
        }
    }

    deleteAccount(event) {
        const recordId = event.target.dataset.recordid;
        deleteRecord(recordId)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Account deleted',
                        variant: 'success'
                    })
                );
                return refreshApex(this.wiredAccountsResult);
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: reduceErrors(error).join(', '),
                        variant: 'error'
                    })
                );
            });
    }

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        registerListener('createdAccount', this.refreshAccountList, this)
    }

    disconnectedCallback() {
        unregisterAllListeners('createdAccount', this.refreshAccountList, this)
    }

    refreshAccountList() {
        refreshApex(this.wiredAccountsResult)
    }

}