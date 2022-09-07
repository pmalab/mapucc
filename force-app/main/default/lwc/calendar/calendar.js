import {
    LightningElement,
    track,
    api
} from "lwc";
import {
    ShowToastEvent
} from "lightning/platformShowToastEvent";
export default class Calendar extends LightningElement {
    @api
    calendarHeadStyle = "border:1px solid #DDDBDA;background-color:#FAFAF9;";
    @api
    calendarContainerStyle = "background-color:#FFFFFF;";
    @api
    calendarCellStyle = "border:1px solid #DDDBDA;";
    @api
    calendarCellEventTextStyle = "background-color:#ECEBEA;border-radius:5px;color:black;cursor:pointer;";
    @api
    modalSize = "small";
    @api
    eventShowNumber = 3;
    @track
    calendarData = [];
    @track
    columns = [{
        label: "SUN",
        fieldName: "sun"
    }, {
        label: "MON",
        fieldName: "mon"
    }, {
        label: "TUE",
        fieldName: "tue"
    }, {
        label: "WED",
        fieldName: "wed"
    }, {
        label: "THU",
        fieldName: "thu"
    }, {
        label: "FRI",
        fieldName: "fri"
    }, {
        label: "SAT",
        fieldName: "sat"
    }];
    @track
    showCreateModal = false;
    @track
    showDetailModal = false;
    @track
    detailModalStatus = false;
    @track
    detailModalIfMulti = false;
    @track
    eventList = [];
    @track
    onProcess = false;
    @track
    @track disableNextMonth;
    eventTypeList = [
        { 'label': 'Single Day Event', 'value': 'single' },
        { 'label': 'Multi Day Event', 'value': 'multi' }
    ];
    @track
    eventInputType = 'single';
    @track
    showMonthChoose = false;
    @track
    showYearChoose = false;
    @track
    showMonthYearChoose = false;
    @track
    monthNow = 0;
    monthOptions = [{
        value: 0, label: 'January'
    }, {
        value: 1, label: 'February'
    }, {
        value: 2, label: 'March'
    }, {
        value: 3, label: 'April'
    }, {
        value: 4, label: 'May'
    }, {
        value: 5, label: 'June'
    }, {
        value: 6, label: 'July'
    }, {
        value: 7, label: 'August'
    }, {
        value: 8, label: 'September'
    }, {
        value: 9, label: 'October'
    }, {
        value: 10, label: 'November'
    }, {
        value: 11, label: 'December'
    },]
    // normal data used to render the calendar
    monthLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    monthNormal = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    monthName = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
    // to show the date in the detail modal
    get dateTempForUser() {
        return new Date(this.dateTemp).toLocaleString();
    }
    // to show the start date in the detail modal
    get dateStartTempForUser() {
        return new Date(this.dateStartTemp).toLocaleString();
    }
    // to show the end date in the detail modal
    get dateEndTempForUser() {
        return new Date(this.dateEndTemp).toLocaleString();
    }
    // render the month name now
    get monthNowText() {
        return this.monthName[this.monthNow];
    }
    // if show multi input 
    get showMultiInput() {
        return this.eventInputType === 'single' ? false : true;
    }
    connectedCallback() {
        this.getBasicData();
        this.generateCalendarData();
        this.getEventListFromParent();
    }
    renderedCallback() {
        this.reduceOtherDayOpactiy();
        this.highlightToday();
        // this.processPadding();
    }
    /**
     * @description: call for event list to initialize
     */
    getEventListFromParent() {
        const event = new CustomEvent('geteventlist', {
            detail: {
                yearNow: this.yearNow,
                monthNow: this.monthNow
            }
        });
        this.dispatchEvent(event);
    }

    toWeekView(){
        let viewNow = "monthView";
        this.template.querySelector(`[data-id="${viewNow}"]`).setAttribute("class","slds-hide");
    }

    dateTileClickHandler(evt) {
        //let the input value equal to the date of the tile clicked
        this.tempDate = new Date(evt.currentTarget.dataset.datestring).toUTCString();
        this.dateNow = new Date(evt.currentTarget.dataset.datestring);
        this.yearNow = this.dateNow.getFullYear();
        this.monthNow = this.dateNow.getMonth();
        this.dayNow = this.dateNow.getDate();
        this.highlightChoosedDay();
        //this.toShowCreateModal();
    }
    /**
     * @description when click the event block, show the detail modal
     * @param {*} evt 
     */
    eventClickHandler(evt) {
        // this.titleTemp = evt.target.title;
        // this.descriptionTemp = evt.target.dataset.description;
        // this.eventId = evt.target.dataset.id;
        // this.i = evt.target.dataset.i;
        // this.j = evt.target.dataset.j
        // this.eventType = evt.target.dataset.type;
        // if (evt.target.dataset.type === "single") {
        //     this.detailModalIfMulti = false;
        //     this.dateTemp = evt.target.dataset.datetime;
        // } else if (evt.target.dataset.type === "multi") {
        //     this.detailModalIfMulti = true;
        //     this.dateStartTemp = evt.target.dataset.datestart;
        //     this.dateEndTemp = evt.target.dataset.dateend;
        // }
        evt.stopPropagation();
        this.titleTemp = evt.currentTarget.title;
        this.descriptionTemp = evt.currentTarget.dataset.description;
        this.eventId = evt.currentTarget.dataset.id;
        this.i = evt.currentTarget.dataset.i;
        this.j = evt.currentTarget.dataset.j
        this.eventType = evt.currentTarget.dataset.type;
        if (evt.currentTarget.dataset.type === "single") {
            this.detailModalIfMulti = false;
            this.dateTemp = evt.currentTarget.dataset.datetime;
        } else if (evt.currentTarget.dataset.type === "multi") {
            this.detailModalIfMulti = true;
            this.dateStartTemp = evt.currentTarget.dataset.datestart;
            this.dateEndTemp = evt.currentTarget.dataset.dateend;
        }
        this.toShowDetailModal();
    }
    /**
     * @description when click "x more events"
     * @param {*} evt 
     */
    clickMoreEvents(evt) {
        evt.stopPropagation();
        let i = evt.currentTarget.dataset.i;
        let j = evt.currentTarget.dataset.j;
        if (this.showEventsRow && this.showEventsColumn) {
            this.calendarData[this.showEventsRow].items[this.showEventsColumn].showMoreEvents = false;
        }
        this.showEventsRow = i;
        this.showEventsColumn = j;
        this.calendarData[i].items[j].showMoreEvents = true;
    }
    /**
     * @description close the event list tab
     */
    closeMoreEvents(evt) {
        evt.stopPropagation();
        this.calendarData[this.showEventsRow].items[this.showEventsColumn].showMoreEvents = false;
    }

    handleEventTypeChange(evt) {
        if (this.template.querySelector(".inputDate")) {
            this.tempDate = this.template.querySelector(".inputDate").value;
        }
        if (this.template.querySelector(".inputStartDate")) {
            this.tempDate = this.template.querySelector(".inputStartDate").value;
        }
        this.eventInputType = evt.detail.value;
    }
    /**
     * @description when click "save" in the "create event" modal
     */
    confirmInfo() {
        if (this.showMultiInput) {
            this.handleMultiDateEventInput();
        } else {
            this.handleSingleDateEventInput();
        }
    }

    handleSingleDateEventInput() {
        let inputDateStatus = JSON.stringify(this.template.querySelector(".inputDate").value);
        let inputDate = this.template.querySelector(".inputDate").value;
        let inputEvent = this.template.querySelector(".inputEvent").value;
        let inputDescription = this.template.querySelector(".inputDescription").value;
        let randomNum = '';
        for (let i = 0; i < 6; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }
        let eventId = new Date(inputDate).toUTCString() + randomNum;
        if (inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 && inputDateStatus !== "null") {
            this.onProcess = true;
            this.template.querySelector(".inputDate").disabled = true;
            this.template.querySelector(".inputEvent").disabled = true;
            this.template.querySelector(".inputDescription").disabled = true;
            const event = new CustomEvent('newsingledateevent', {
                detail: {
                    eventType: 'single',
                    dateTime: inputDate,
                    eventInfo: inputEvent,
                    eventDescription: inputDescription,
                    eventId: eventId
                }
            });
            this.dispatchEvent(event);
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }

    handleMultiDateEventInput() {
        let inputStartDateStatus = JSON.stringify(this.template.querySelector(".inputStartDate").value);
        let inputEndDateStatus = JSON.stringify(this.template.querySelector(".inputEndDate").value);
        let inputStartDate = this.template.querySelector(".inputStartDate").value;
        let inputEndDate = this.template.querySelector(".inputEndDate").value;
        let inputEvent = this.template.querySelector(".inputEvent").value;
        let inputDescription = this.template.querySelector(".inputDescription").value;
        let randomNum = '';
        for (let i = 0; i < 6; i++) {
            randomNum += Math.floor(Math.random() * 10);
        }
        let eventId = new Date(inputStartDate).toUTCString() + randomNum;
        if (inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 && inputStartDateStatus !== "null" && inputEndDateStatus !== "null" && new Date(inputStartDate).getTime() < new Date(inputEndDate).getTime()) {
            if (new Date(inputStartDate).toDateString() === new Date(inputEndDate).toDateString()) {
                this.showToast("ERROR", "You input the same date", "error");
            } else {
                this.onProcess = true;
                this.template.querySelector(".inputStartDate").disabled = true;
                this.template.querySelector(".inputEndDate").disabled = true;
                this.template.querySelector(".inputEvent").disabled = true;
                this.template.querySelector(".inputDescription").disabled = true;
                const event = new CustomEvent('newmultidateevent', {
                    detail: {
                        eventType: 'multi',
                        dateStart: inputStartDate,
                        dateEnd: inputEndDate,
                        eventInfo: inputEvent,
                        eventDescription: inputDescription,
                        eventId: eventId
                    }
                });
                this.dispatchEvent(event);
            }
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }

    @api
    addEvent(result, event) {
        this.onProcess = false;
        if (event.eventType === "single") {
            this.template.querySelector(".inputDate").disabled = false;
            this.template.querySelector(".inputEvent").disabled = false;
            this.template.querySelector(".inputDescription").disabled = false;
        } else {
            this.template.querySelector(".inputStartDate").disabled = false;
            this.template.querySelector(".inputEndDate").disabled = false;
            this.template.querySelector(".inputEvent").disabled = false;
            this.template.querySelector(".inputDescription").disabled = false;
        }
        if (result) {
            this.toHideCreateModal();
            this.showToast("Success", "Create Success", "success");
            this.eventList.push(event);
            let eventList = [event];
            this.renderEvent(eventList);
        } else {
            this.showToast("Failure", "Create Failure. Please try again later", "error");
        }
    }
    /**
     * @description render event
     * @param {*} eventList 
     */
    generateCalendarData() {
        let totalDay = this.getIfLeap(this.monthNow, this.yearNow); //get the total day count of this month
        let firstDay = this.getDayStart(this.monthNow, this.yearNow); //get the first day(week) of this month
        //get next page day
        let nextPageMonth = this.monthNow + 1;
        let nextPageYear = this.yearNow;
        if (nextPageMonth > 11) {
            nextPageYear = this.yearNow + 1;
            nextPageMonth = 0;
        }
        //get previous page day
        let prevPageMonth = this.monthNow - 1;
        let prevPageYear = this.yearNow;
        if (prevPageMonth < 0) {
            prevPageYear = this.yearNow - 1;
            prevPageMonth = 11;
        }
        let calendarList = [];
        let count = 0;
        let countN = 0;
        let countP = this.getIfLeap(prevPageMonth, prevPageYear) - firstDay;
        let k = 0;
        // assemble the calendar list
        for (let i = 0; i < 6; i++) {
            let itemList = [];
            if (i === 0) {
                for (k = 1; k <= firstDay; k++) {
                    countP++;
                    itemList.push({
                        value: countP + "",
                        type: "",
                        label: countP + "",
                        index: countP + "",
                        items: [],
                        itemsShow: [],
                        itemsMultiShow: [],
                        status: "prevMonth",
                        dateString: new Date(prevPageYear + '-' + (prevPageMonth + 1) + '-' + countP).toLocaleDateString(),
                        haveMoreEvents: false,
                        showMoreEvents: false,
                        eventCount: 0,
                        i: 0,
                        j: 0,
                        itemsMulti: []
                    });
                }
                k--;
            } else {
                k = 0;
            }
            for (let j = 0; j < 7 - k; j++) {
                count++;
                if (count > totalDay) {
                    countN++;
                    itemList.push({
                        value: countN + "",
                        type: "",
                        label: countN + "",
                        index: countN + "",
                        items: [],
                        itemsShow: [],
                        itemsMultiShow: [],
                        status: "nextMonth",
                        dateString: new Date(nextPageYear + '-' + (nextPageMonth + 1) + '-' + countN).toLocaleDateString(),
                        haveMoreEvents: false,
                        showMoreEvents: false,
                        eventCount: 0,
                        i: 0,
                        j: 0,
                        itemsMulti: []
                    });
                } else {
                    let dateStr = new Date(this.yearNow + '-' + (this.monthNow + 1) + '-' + count).toLocaleDateString();
                    console.log("dateStr==>>"+dateStr);
                    let dateString = this.yearNow + '/' + (this.monthNow + 1) + '/' + count;
                    itemList.push({
                        value: count + "",
                        type: "",
                        label: count + "",
                        index: count,
                        items: [],
                        itemsShow: [],
                        itemsMultiShow: [],
                        status: "thisMonth",
                        dateString: dateString,
                        haveMoreEvents: false,
                        showMoreEvents: false,
                        eventCount: 0,
                        i: 0,
                        j: 0,
                        itemsMulti: []
                    });
                }
            }
            calendarList.push({
                items: itemList
            });
        }
        // console.log(calendarList);
        this.calendarData = calendarList;
    }
    /**
     * @description highlight the tile of today
     */
    highlightToday() {
        let dateString = new Date(this.yearOrigin + '-' + (this.monthOrigin + 1) + '-' + this.dayOrigin).toLocaleDateString();
        //to fix a funny bug.
        let tileList = this.template.querySelectorAll(".dateTile");
        for (let i = 0; i < tileList.length; i++) {
            tileList[i].style.backgroundColor = "white";
        }
        if (this.template.querySelector(`[data-datestring="${dateString}"]`)) {
            this.template.querySelector(`[data-datestring="${dateString}"]`).style.backgroundColor = "#f0fbff";
        }
    }

    /**
     * @description highlight the tile of today
     */
    highlightChoosedDay() {
        let dateString = this.yearNow + '/' + (this.monthNow + 1) + '/' + this.dayNow;
        //let dateString = new Date(this.yearNow + '-' + (this.monthNow + 1) + '-' + this.dayNow).toLocaleDateString();
        //to fix a funny bug.
        let tileList = this.template.querySelectorAll(".dateTile");
        for (let i = 0; i < tileList.length; i++) {
            tileList[i].style.backgroundColor = "white";
        }
        if (this.template.querySelector(`[data-datestring="${dateString}"]`)) {
            this.template.querySelector(`[data-datestring="${dateString}"]`).style.backgroundColor = "#f0fbff";
        }
    }
    /**
     * @description to assemble the events with the date tile
     */
    @api
    renderEvent(eventList) {
        for (let i = 0; i < eventList.length; i++) {
            this.eventList.push(eventList[i]);
        }
        let eventDate;
        let dateString;
        let dateHour;
        let dateMin;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                this.calendarData[i].items[j].i = i;
                this.calendarData[i].items[j].j = j;
                for (let k = 0; k < eventList.length; k++) {
                    if (eventList[k].eventType === "single") {
                        eventDate = new Date(eventList[k].dateTime);
                        dateString = eventDate.toLocaleDateString();
                        if (dateString === this.calendarData[i].items[j].dateString) {
                            dateHour = eventDate.getHours() + ':';
                            dateMin = eventDate.getMinutes() > 10 ? eventDate.getMinutes() : '0' + eventDate.getMinutes();
                            this.calendarData[i].items[j].items.push({
                                label: eventList[k].eventInfo,
                                dateTime: eventList[k].dateTime,
                                description: eventList[k].eventDescription,
                                labelTime: dateHour + dateMin,
                                eventId: eventList[k].eventId,
                                eventType: eventList[k].eventType,
                                i: i,
                                j: j
                            });
                            this.calendarData[i].items[j].eventCount++;
                        }
                    } else if (eventList[k].eventType === "multi") {
                        if (new Date(this.calendarData[i].items[j].dateString).getTime() >= new Date(new Date(eventList[k].dateStart).setHours(0, 0, 0, 0)).getTime() &&
                            new Date(this.calendarData[i].items[j].dateString).getTime() <= new Date(eventList[k].dateEnd).getTime()) {
                            this.calendarData[i].items[j].itemsMulti.push({
                                label: eventList[k].eventInfo,
                                dateStart: eventList[k].dateStart,
                                dateEnd: eventList[k].dateEnd,
                                description: eventList[k].eventDescription,
                                labelTime: dateHour + dateMin,
                                eventId: eventList[k].eventId,
                                eventType: eventList[k].eventType,
                                i: i,
                                j: j
                            })
                        }
                    }
                }
            }
        }
        this.sortEvent();
        this.processShowEvent();
        console.log(this.calendarData);
    }
    /**
     * @description sort event list in every tile
     */
    sortEvent() {
        let temp;
        let t1;
        let t2;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let listLength = this.calendarData[i].items[j].items.length;
                let listLengthMulti = this.calendarData[i].items[j].itemsMulti.length;
                if (listLength > 1) {
                    for (let k = listLength - 1; 0 < k; k--) {
                        for (let l = 0; l < k; l++) {
                            t1 = new Date(this.calendarData[i].items[j].items[l].dateTime).getTime();
                            t2 = new Date(this.calendarData[i].items[j].items[l + 1].dateTime).getTime();
                            if (t1 > t2) {
                                temp = this.calendarData[i].items[j].items[l];
                                this.calendarData[i].items[j].items[l] = this.calendarData[i].items[j].items[l + 1];
                                this.calendarData[i].items[j].items[l + 1] = temp;
                            }
                        }
                    }
                }
                if (listLengthMulti > 1) {
                    for (let k = listLengthMulti - 1; 0 < k; k--) {
                        for (let l = 0; l < k; l++) {
                            t1 = new Date(this.calendarData[i].items[j].itemsMulti[l].dateStart).getTime();
                            t2 = new Date(this.calendarData[i].items[j].itemsMulti[l + 1].dateStart).getTime();
                            if (t1 > t2) {
                                temp = this.calendarData[i].items[j].itemsMulti[l];
                                this.calendarData[i].items[j].itemsMulti[l] = this.calendarData[i].items[j].itemsMulti[l + 1];
                                this.calendarData[i].items[j].itemsMulti[l + 1] = temp;
                            }
                        }
                    }
                }
            }
        }
    }

    processShowEvent() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                let listLength = this.calendarData[i].items[j].items.length;
                let listLengthMulti = this.calendarData[i].items[j].itemsMulti.length;
                this.calendarData[i].items[j].itemsShow = [];
                this.calendarData[i].items[j].itemsMultiShow = [];
                if (listLength + listLengthMulti > this.eventShowNumber + 1) {
                    this.calendarData[i].items[j].haveMoreEvents = true;
                    if (listLengthMulti >= this.eventShowNumber) {
                        for (let k = 0; k < this.eventShowNumber; k++) {
                            this.calendarData[i].items[j].itemsMultiShow.push(this.calendarData[i].items[j].itemsMulti[k]);
                        }
                    } else {
                        for (let k = 0; k < listLengthMulti; k++) {
                            this.calendarData[i].items[j].itemsMultiShow.push(this.calendarData[i].items[j].itemsMulti[k]);
                        }
                        let lengthTemp = this.calendarData[i].items[j].itemsMultiShow.length;
                        for (let k = 0; k < this.eventShowNumber - lengthTemp; k++) {
                            this.calendarData[i].items[j].itemsShow.push(this.calendarData[i].items[j].items[k]);
                        }
                    }
                    this.calendarData[i].items[j].eventCount = listLength + listLengthMulti - this.eventShowNumber;
                } else {
                    this.calendarData[i].items[j].haveMoreEvents = false;
                }
            }
        }
    }

    toDeleteEvent() {
        this.onProcess = true;
        const event = new CustomEvent('deleteevent', {
            detail: {
                eventId: this.eventId
            }
        });
        this.dispatchEvent(event);
    }
    @api
    deleteEvent(result) {
        if (this.eventType === "single") {
            this.onProcess = false;
            if (result) {
                for (let i = 0; i < this.calendarData[this.i].items[this.j].items.length; i++) {
                    if (this.calendarData[this.i].items[this.j].items[i].eventId === this.eventId) {
                        this.calendarData[this.i].items[this.j].items.splice(i, 1);
                        this.calendarData[this.i].items[this.j].eventCount--;
                        if (this.calendarData[this.i].items[this.j].eventCount <= this.eventShowNumber) {
                            this.calendarData[this.i].items[this.j].showMoreEvents = false;
                        }
                        this.toHideDetailModal();
                    }
                }
                for (let x = 0; x < this.eventList.length; x++) {
                    if (this.eventList[x].eventId === this.eventId) {
                        this.eventList.splice(x, 1);
                    }
                }
                this.showToast("Success", "Delete Success", "success");
                this.sortEvent();
                this.processShowEvent();
            } else {
                this.showToast("Failure", "Delete Failure. Please try again later", "error");
            }
        } else if (this.eventType === "multi") {
            this.onProcess = false;
            if (result) {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        for (let k = 0; k < this.calendarData[i].items[j].itemsMulti.length; k++) {
                            if (this.calendarData[i].items[j].itemsMulti[k].eventId === this.eventId) {
                                this.calendarData[i].items[j].itemsMulti.splice(k, 1);
                                this.calendarData[i].items[j].eventCount--;
                                if (this.calendarData[i].items[j].eventCount <= this.eventShowNumber) {
                                    this.calendarData[i].items[j].showMoreEvents = false;
                                }
                                this.toHideDetailModal();
                                this.detailModalStatus = false;
                            }
                        }
                    }
                }
                for (let x = 0; x < this.eventList.length; x++) {
                    if (this.eventList[x].eventId === this.eventId) {
                        this.eventList.splice(x, 1);
                    }
                }
                this.showToast("Success", "Delete Success", "success");
                this.sortEvent();
                this.processShowEvent();
            } else {
                this.showToast("Failure", "Delete Failure. Please try again later", "error");
            }
        }
    }

    toEdit() {
        this.detailModalStatus = true;
        if (this.eventType === "single") {
            this.dateTempEdit = this.dateTemp
        } else if (this.eventType === "multi") {
            this.dateStartTempEdit = this.dateStartTemp;
            this.dateEndTempEdit = this.dateEndTemp;
        }
        this.titleTempEdit = this.titleTemp;
        this.descriptionTempEdit = this.descriptionTemp;
    }
    toSaveEdit() {
        if (this.eventType === "single") {
            this.handleSingleSaveEdit();
        } else if (this.eventType === "multi") {
            this.handleMultiSaveEdit();
        }
    }
    handleSingleSaveEdit() {
        let inputDateStatus = JSON.stringify(this.template.querySelector(".inputDateEdit").value);
        let inputDate = this.template.querySelector(".inputDateEdit").value;
        let inputEvent = this.template.querySelector(".inputEventEdit").value;
        let inputDescription = this.template.querySelector(".inputDescriptionEdit").value;
        if (inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 && inputDateStatus !== "null") {
            this.onProcess = true;
            this.template.querySelector(".inputDateEdit").disabled = true;
            this.template.querySelector(".inputEventEdit").disabled = true;
            this.template.querySelector(".inputDescriptionEdit").disabled = true;
            this.dateTempEdit = inputDate;
            this.titleTempEdit = inputEvent;
            this.descriptionTempEdit = inputDescription;
            const event = new CustomEvent('editevent', {
                detail: {
                    dateTime: inputDate,
                    eventInfo: inputEvent,
                    eventDescription: inputDescription,
                    eventId: this.eventId,
                    eventType: this.eventType
                }
            });
            this.dispatchEvent(event);
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }
    handleMultiSaveEdit() {
        let inputStartDateStatus = JSON.stringify(this.template.querySelector(".inputStartDateEdit").value);
        let inputStartDate = this.template.querySelector(".inputStartDateEdit").value;
        let inputEndDateStatus = JSON.stringify(this.template.querySelector(".inputEndDateEdit").value);
        let inputEndDate = this.template.querySelector(".inputEndDateEdit").value;
        let inputEvent = this.template.querySelector(".inputEventEdit").value;
        let inputDescription = this.template.querySelector(".inputDescriptionEdit").value;
        if (inputEvent.replace(/(^s*)|(s*$)/g, "").length !== 0 && inputStartDateStatus !== "null" && inputEndDateStatus !== "null" && new Date(inputStartDate).getTime() < new Date(inputEndDate).getTime()) {
            this.onProcess = true;
            this.template.querySelector(".inputStartDateEdit").disabled = true;
            this.template.querySelector(".inputEndDateEdit").disabled = true;
            this.template.querySelector(".inputEventEdit").disabled = true;
            this.template.querySelector(".inputDescriptionEdit").disabled = true;
            this.dateStartTempEdit = inputStartDate;
            this.dateEndTempEdit = inputEndDate;
            this.titleTempEdit = inputEvent;
            this.descriptionTempEdit = inputDescription;
            const event = new CustomEvent('editevent', {
                detail: {
                    dateStart: inputStartDate,
                    dateEnd: inputEndDate,
                    eventInfo: inputEvent,
                    eventDescription: inputDescription,
                    eventId: this.eventId,
                    eventType: this.eventType
                }
            });
            this.dispatchEvent(event);
        } else {
            this.showToast("ERROR", "Illegal input", "error");
        }
    }
    @api
    editEvent(result) {
        if (this.eventType === "single") {
            this.onProcess = false;
            this.template.querySelector(".inputDateEdit").disabled = false;
            this.template.querySelector(".inputEventEdit").disabled = false;
            this.template.querySelector(".inputDescriptionEdit").disabled = false;
            if (result) {
                for (let k = 0; k < this.calendarData[this.i].items[this.j].items.length; k++) {
                    if (this.calendarData[this.i].items[this.j].items[k].eventId === this.eventId) {
                        this.calendarData[this.i].items[this.j].items.splice(k, 1);
                        this.calendarData[this.i].items[this.j].eventCount--;
                        if (this.calendarData[this.i].items[this.j].eventCount <= this.eventShowNumber) {
                            this.calendarData[this.i].items[this.j].showMoreEvents = false;
                        }
                        this.toHideDetailModal();
                        this.detailModalStatus = false;
                    }
                }
                for (let x = 0; x < this.eventList.length; x++) {
                    if (this.eventList[x].eventId === this.eventId) {
                        this.eventList.splice(x, 1);
                    }
                }
                let eventList = [{
                    dateTime: this.dateTempEdit,
                    eventInfo: this.titleTempEdit,
                    eventDescription: this.descriptionTempEdit,
                    eventId: this.eventId,
                    eventType: "single"
                }];
                this.renderEvent(eventList);
                this.showToast("Success", "Edit Success", "success");
                this.sortEvent();
                this.processShowEvent();
            } else {
                this.showToast("Failure", "Edit Failure. Please try again later", "error");
            }
        } else if (this.eventType === "multi") {
            this.onProcess = false;
            this.template.querySelector(".inputStartDateEdit").disabled = false;
            this.template.querySelector(".inputEndDateEdit").disabled = false;
            this.template.querySelector(".inputEventEdit").disabled = false;
            this.template.querySelector(".inputDescriptionEdit").disabled = false;
            if (result) {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 7; j++) {
                        for (let k = 0; k < this.calendarData[i].items[j].itemsMulti.length; k++) {
                            if (this.calendarData[i].items[j].itemsMulti[k].eventId === this.eventId) {
                                this.calendarData[i].items[j].itemsMulti.splice(k, 1);
                                this.calendarData[i].items[j].eventCount--;
                                if (this.calendarData[i].items[j].eventCount <= this.eventShowNumber) {
                                    this.calendarData[i].items[j].showMoreEvents = false;
                                }
                                this.toHideDetailModal();
                                this.detailModalStatus = false;
                            }
                        }
                    }
                }
                for (let x = 0; x < this.eventList.length; x++) {
                    if (this.eventList[x].eventId === this.eventId) {
                        this.eventList.splice(x, 1);
                    }
                }
                let eventList = [{
                    dateStart: this.dateStartTempEdit,
                    dateEnd: this.dateEndTempEdit,
                    eventInfo: this.titleTempEdit,
                    eventDescription: this.descriptionTempEdit,
                    eventId: this.eventId,
                    eventType: "multi"
                }];
                this.renderEvent(eventList);
                this.sortEvent();
                this.processShowEvent();
                this.showToast("Success", "Edit Success", "success");
            } else {
                this.showToast("Failure", "Edit Failure. Please try again later", "error");
            }
        }
    }
    backToDetail() {
        this.detailModalStatus = false;
    }
    toPrevMonth() {
        this.template.querySelector(".nextMonthButtonDisabled").disabled = false;
        if(this.monthNow<=this.monthOrigin){
            this.template.querySelector(".preMonthButtonDisabled").disabled = true;
            return;
        }
        this.monthNow--;
        if (this.monthNow < 0) {
            this.yearNow--;
            this.monthNow = 11;
        }
        this.generateCalendarData();
        this.getEventListFromParent();
    }
    toNextMonth() {
        this.template.querySelector(".preMonthButtonDisabled").disabled = false;
        if((this.monthNow-this.monthOrigin)>=3){
            this.template.querySelector(".nextMonthButtonDisabled").disabled = true;
            return;
        }
        this.monthNow++;
        if (this.monthNow > 11) {
            this.yearNow++;
            this.monthNow = 0;
        }
        this.generateCalendarData();
        this.getEventListFromParent();
    }
    toToday() {
        this.getBasicData();
        this.highlightToday();
        //this.monthNow = this.monthOrigin;
        //this.yearNow = this.yearOrigin;
        this.generateCalendarData();
        this.getEventListFromParent();
    }
    newEvent() {
        this.tempDate = "";
        this.toShowCreateModal();
        this.showMultiInput = false;
    }
    reduceOtherDayOpactiy() {
        let prevDayList = this.template.querySelectorAll(`[data-datestatus="prevMonth"]`);
        for (let i = 0; i < prevDayList.length; i++) {
            prevDayList[i].style.color = "#dfdfdf";
        }
        let nextDayList = this.template.querySelectorAll(`[data-datestatus="nextMonth"]`);
        for (let i = 0; i < nextDayList.length; i++) {
            nextDayList[i].style.color = "#dfdfdf";
        }
    }
    clickMonthYearHandler() {
        this.toShowMonthYearModal();
    }

    showToast(title, message, variant) {
        const showToastEvent = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(showToastEvent);
    }
    /**
     * @description generate the basic data to render the calendar
     */
    getBasicData() {
        this.dateNow = new Date();
        this.yearNow = this.dateNow.getFullYear();
        this.monthNow = this.dateNow.getMonth();
        this.dayNow = this.dateNow.getDate();
        this.yearOrigin = this.yearNow;
        this.monthOrigin = this.monthNow;
        this.dayOrigin = this.dayNow;
    }
    /**
     * @description get the first day of a month
     */
    getDayStart(month, year) {
        let tmpDate = new Date(year, month, 1);
        return tmpDate.getDay();
    }
    /**
     * @description get the day count of a month in consideration of the leap year.
     * @param {*} month 
     * @param {*} year 
     */
    getIfLeap(month, year) {
        let tmp = year % 4;
        let monthDayNumber = 0;
        if (tmp === 0) {
            monthDayNumber = this.monthLeap[month];
        } else {
            monthDayNumber = this.monthNormal[month];
        }
        return monthDayNumber;
    }

    stopBubble(evt) {
        evt.stopPropagation();
    }
    @api
    toShowCreateModal() {
        this.showCreateModal = true;
    }
    @api
    toHideCreateModal() {
        this.showCreateModal = false;
    }

    processPadding() {
        // let list = this.template.querySelectorAll(".calendarCellEventStyle");
        // for (let i = 0; i < list.length; i++) {
        // list[i].style.paddingBottom = "65.97%";
        // }
        // this.template.querySelector(`[data-datestring="10/9/2019"][data-type="tile"]`).style.paddingBottom = "0%";
        // this.template.querySelector(`[data-datestring="10/10/2019"][data-type="tile"]`).style.paddingBottom = "20%";
        // this.template.querySelector(`[data-datestring="10/11/2019"][data-type="tile"]`).style.paddingBottom = "20%";
        // this.template.querySelector(`[data-datestring="10/12/2019"][data-type="tile"]`).style.paddingBottom = "20%";
        // this.template.querySelector(`[data-datestring="10/13/2019"][data-type="tile"]`).style.paddingBottom = "49.48%";
    }

    get createModalCss() {
        let showCreateModal = this.showCreateModal ? "slds-slide-up-open" : "";
        return `slds-modal slds-modal_${this.modalSize} ${showCreateModal}`;
    }

    get createBackdropCss() {
        return this.showCreateModal ?
            "slds-backdrop slds-backdrop_open" :
            "slds-backdrop";
    }

    @api
    toShowDetailModal() {
        this.showDetailModal = true;
    }
    @api
    toHideDetailModal() {
        this.showDetailModal = false;
    }

    get detailModalCss() {
        let showDetailModal = this.showDetailModal ? "slds-slide-up-open" : "";
        return `slds-modal slds-modal_${this.modalSize} ${showDetailModal}`;
    }

    get detailBackdropCss() {
        return this.showDetailModal ?
            "slds-backdrop slds-backdrop_open" :
            "slds-backdrop";
    }


    toShowMonthYearModal() {
        this.showMonthYearModal = true;
    }

    toHideMonthYearModal() {
        this.showMonthYearModal = false;
    }

    get monthYearModalCss() {
        let showMonthYearModal = this.showMonthYearModal ? "slds-slide-up-open" : "";
        return `slds-modal slds-modal_${this.modalSize} ${showMonthYearModal}`;
    }

    get monthYearBackdropCss() {
        return this.showMonthYearModal ?
            "slds-backdrop slds-backdrop_open" :
            "slds-backdrop";
    }
}