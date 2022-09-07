import { LightningElement,track } from 'lwc';
export default class ModalPopupLWC extends LightningElement {
    //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
    @track isModalOpen = false;
    @track phoneNumber='(347) 530-6181';
    connectedCallback() {
        this.savePhoneData = this.formatPhone(this.phoneNumber);
    }
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    submitDetails() {
        // to close modal set isModalOpen tarck value as false
        //Add your code to call apex method or do some processing
        this.isModalOpen = false;
    }

    formatPhone(value){
        let realPhone = '';
        let phoneNumber = value.replace(/ /g, '');
        // console.log('phonenumbe...' + phoneNumber);
        if (phoneNumber.charAt(0) === '1') {
            //console.log('US AND 1');
            //console.log('trim ' + phoneNumber.substring(1));
            realPhone= phoneNumber.substring(1);
            // console.log('caller... ' + this.callerNum);
        } else {
            realPhone = phoneNumber;
        }
        let formattedPhone = '';
        let str = realPhone.replace(/-/g, '').replace(/[^0-9]/g, '');
        let len = str.length;
        switch (true) {
            case len > 10:
                str = '('+str.substr(0, 3) + ') ' + str.substr(3, 3) + '-' + str.substr(6, 4);
                formattedPhone = str;
                break;
            case len > 6:
                str = '('+str.substr(0, 3) + ') ' + str.substr(3, 3) + '-' + str.substr(6);
                formattedPhone = str;
                break;
            case len > 3:
                str = str.substr(0, 3) + '-' + str.substr(3);
                formattedPhone = str;
                break;
            default:
                formattedPhone = str;
        }

        return formattedPhone;
    }
}