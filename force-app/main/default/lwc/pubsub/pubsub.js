/**
 * A basic pub-sub mechanism for sibling component communication
 *
 * TODO - adopt standard flexipage sibling communication mechanism when it's available.
 */

//import pass_Message_ERROR from '@salesforce/label/c.SCRPS_Common_ErrorMessage';
const events = {};

/**
 * Registers a callback for an event
 * @param {string} eventName - Name of the event to listen for.
 * @param {function} callback - Function to invoke when said event is fired.
 * @param {object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 */
const registerListener = (eventName, callback, thisArg) => {
    if (!events[eventName]) {
        events[eventName] = [];
    }

    const duplicate = events[eventName].find(listener => {
        return listener.callback === callback && listener.thisArg === thisArg;
    });

    if (!duplicate) {
        events[eventName].push({ callback, thisArg });
    }
};

/**
 * Unregisters a callback for an event
 * @param {string} eventName - Name of the event to unregister from.
 * @param {function} callback - Function to unregister.
 * @param {object} thisArg - The value to be passed as the this parameter to the callback function is bound.
 */
const unregisterListener = (eventName, callback, thisArg) => {
    if (events[eventName]) {
        events[eventName] = events[eventName].filter(
            listener =>
                listener.callback !== callback || listener.thisArg !== thisArg
        );
    }
};

/**
 * Unregisters all event listeners bound to an object.
 * @param {object} thisArg - All the callbacks bound to this object will be removed.
 */
const unregisterAllListeners = thisArg => {
    Object.keys(events).forEach(eventName => {
        events[eventName] = events[eventName].filter(
            listener => listener.thisArg !== thisArg
        );
    });
};

/**
 * Fires an event to listeners.
 * @param {object} pageRef - Reference of the page that represents the event scope.
 * @param {string} eventName - Name of the event to fire.
 * @param {*} payload - Payload of the event to fire.
 */
const fireEvent = (pageRef, eventName, payload) => {
    if (events[eventName]) {
        const listeners = events[eventName];
        listeners.forEach(listener => {
            try {
                listener.callback.call(listener.thisArg, payload);
            } catch (error) {
                // fail silently
            }
        });
    }
};

const postCoePageParameter = value => {
    console.log(typeof value);
    let valueString = '';
    sessionStorage.setItem('CoePpType', typeof value);
    if (typeof value === 'object') {
        valueString = JSON.stringify(value);
    } else {
        valueString = value + '';
    }
    sessionStorage.setItem('CoePp', valueString);
};

const getCoePageParameter = () => {
    let value = '';
    let type = sessionStorage.getItem('CoePpType');
    if (type === 'object') {
        value = JSON.parse(sessionStorage.getItem('CoePp'));
    } else {
        value = sessionStorage.getItem('CoePp');
    }
    // sessionStorage.removeItem('CoePp');
    // sessionStorage.removeItem('CoePpType');
    return value;
};

const checkLayout = () => {
    let width = window.innerWidth;
    let layout = {
        isWideLayout: false,
        isNarrowLayout: false
    }
    if (width >= 768) {
        layout.isWideLayout = true;
    } else {
        layout.isNarrowLayout = true;
    }
    return layout;
}

const formatDate = (date) => {
    let value;
    if (date) {
        if (date instanceof Date) {
            value = Intl.DateTimeFormat('en_US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).format(date);
        } else if (typeof date === 'string') {
            if (date.indexOf('T') >= 0) {
                date = date.substr(0, date.indexOf('T'));
            }
            let dateStr = date.split('-');
            if (dateStr.length > 2) {
                value = [dateStr[1], dateStr[2], dateStr[0]].join('/');
            } else {
                let d = new Date(date);
                let month = '' + (d.getMonth() + 1);
                let day = '' + d.getDate();
                let year = '' + d.getFullYear();

                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                value = [month, day, year].join('/');
            }
        } else {
            value = date;
        }
    }
    return value;
};

const catchError = (err) => {
    let errorMessage = err.body ? err.body.message : err;
    fireEvent('', 'showErrorPopup', {
        title: 'Error',
        message: errorMessage
    });
}

const queryParameters = () => {
    var params = {};
    var search = location.search.substring(1);

    if (search) {
        params = JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}', (key, value) => {
            return key === '' ? value : decodeURIComponent(value)
        });
    }

    return params;
}

export {
    registerListener,
    unregisterListener,
    unregisterAllListeners,
    fireEvent,
    postCoePageParameter,
    getCoePageParameter,
    formatDate,
    checkLayout,
    catchError,
    queryParameters
};