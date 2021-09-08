import { LightningElement, api, wire,track } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { CloseActionScreenEvent } from 'lightning/actions';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import FNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LNAME_FIELD from '@salesforce/schema/Contact.LastName';
import PHONE_FIELD from '@salesforce/schema/Contact.Phone';
import ID_FIELD from '@salesforce/schema/Contact.Id';

const FIELDS = [FNAME_FIELD, LNAME_FIELD, PHONE_FIELD];

export default class screenActionSample extends LightningElement {
    disabled = false;
    @api recordId;
    @api objectApiName;

    contact;

    @track firstName;

    @track lastName;

    @track phone;

    @track showSpin = false;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ error, data }) {
        if (error) {
            //TODO
        }  else if (data) {
            this.contact = data;
            this.firstName = this.contact.fields.FirstName.value;
            this.lastName = this.contact.fields.LastName.value;
            this.phone = this.contact.fields.Phone.value;
        }
    }

    handleCancel(event) {
       // Add your cancel button implementation here
       this.dispatchEvent(new CloseActionScreenEvent());
    }

    handleChange(event) {
        let source = event.target.name;
        if(source === 'firstName') {
                this.firstName = event.target.value;
        } else if(source === 'lastName') {
                this.lastName = event.target.value;
        } else if(source === 'phone') {
                this.phone = event.target.value;
        }
    }

    handleSubmit(e) {
        this.showSpin = true;
        // Add your updateRecord implementation
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.recordId;
        fields[FNAME_FIELD.fieldApiName] = this.firstName;
        fields[LNAME_FIELD.fieldApiName] = this.lastName;
        fields[PHONE_FIELD.fieldApiName] = this.phone;
        const recordInput = { fields };
        console.log(JSON.stringify(recordInput));
        updateRecord(recordInput)
                .then(() => {
                    this.showSpin = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact updated',
                            variant: 'success'
                        })
                    );
                    this.dispatchEvent(new CloseActionScreenEvent());
                })
                .catch(error => {
                    this.showSpin = false;
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error creating record',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
    }
}