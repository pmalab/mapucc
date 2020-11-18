import { LightningElement, track } from 'lwc';

export default class HelloIterator extends LightningElement {
    @track isTrueTemplate = true;
    changeHandler(event) {
        console.log(this.isTrueTemplate+'==='+event.target.checked);

        this.isTrueTemplate = event.target.checked;
    }
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
}