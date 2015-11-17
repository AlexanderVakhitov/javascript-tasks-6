'use strict';

var INIT_DATE = new Date('1970-01-01');
var MS_PER_MINUTE = 60 * 1000;
var MS_PER_HOUR = 60 * MS_PER_MINUTE;
var MS_PER_DAY = 24 * MS_PER_HOUR;
var DAYS_LIST = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

module.exports = function (pattern) {
    return {
        _date: initDate(pattern),
        _timezone: initTimezone(pattern),

        set date(pattern) {
            this._date = initDate(pattern);
            this._timezone = initTimezone(pattern);
        },

        get date() {
            return this._date.getTime();
        },

        set timezone(value) {
            this._timezone = value;
        },

        get timezone() {
            return this._timezone;
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            var date = new Date(this.date + this.timezone * MS_PER_HOUR);
            return pattern
                .replace('%DD', DAYS_LIST[date.getUTCDay()])
                .replace('%HH', addZero(date.getUTCHours()))
                .replace('%MM', addZero(date.getUTCMinutes()));
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var diffTime = this.date - moment.date +
                (this.timezone - moment.timezone) * MS_PER_HOUR;
            var infoTime = [];
            infoTime.push(parseInt(diffTime / MS_PER_DAY, 10));
            infoTime.push(parseInt(diffTime % MS_PER_DAY / MS_PER_HOUR, 10));
            infoTime.push(parseInt(diffTime % MS_PER_DAY % MS_PER_HOUR / MS_PER_MINUTE, 10));
            return printTime(infoTime);
        }
    };
};

function initDate(pattern) {
    if (pattern) {
        if (pattern instanceof Date) {
            return pattern;
        }
        return makeDate(pattern);
    }
    return null;
}

function initTimezone(pattern) {
    if (pattern) {
        return parseInt(pattern.substr(8, 2), 10);
    }
    return null;
}

function printTime(infoTime) {
    return 'До ограбления: ' +
        chooseCase(infoTime[0], ['день', 'дня', 'дней']) +
        chooseCase(infoTime[1], ['час', 'часа', 'часов']) +
        chooseCase(infoTime[2], ['минута', 'минуты', 'минут']);
}

function chooseCase(value, cases) {
    if (value <= 0) {
        return '';
    }
    if (value >= 11 && value <= 19) {
        return value + ' ' + cases[2] + ' ';
    }
    var i = value % 10;
    switch (i) {
        case 1:
            return value + ' ' + cases[0] + ' ';
        case 2:
        case 3:
        case 4:
            return value + ' ' + cases[1] + ' ';
        default:
            return value + ' ' + cases[2] + ' ';
    }
}

function makeDate(pattern) {
    var parseDate = {};
    parseDate.day = DAYS_LIST.indexOf(pattern.substr(0, 2));
    parseDate.hours = parseInt(pattern.substr(3, 2), 10);
    parseDate.minutes = parseInt(pattern.substr(6, 2), 10);
    parseDate.timezone = initTimezone(pattern);

    var date = new Date(INIT_DATE.getTime());
    date.setUTCDate(INIT_DATE.getDate() + (7 - INIT_DATE.getUTCDay() + parseDate.day));
    date.setUTCHours(parseDate.hours - parseDate.timezone, parseDate.minutes, 0, 0);

    return date;
}

function addZero(value) {
    return (value < 10 ? '0' : '') + value;
}
