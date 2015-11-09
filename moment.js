'use strict';

var INIT_DATE = new Date('1970-01-01');
var MS_PER_MINUTE = 60 * 1000;
var MS_PER_HOUR = 60 * 60 * 1000;
var MS_PER_DAY = 24 * 60 * 60 * 1000;
var DAYS_LIST = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

module.exports = function (pattern) {
    return {
        _date: _initDate(pattern),
        _timezone: _initTimezone(pattern),

        set date(pattern) {
            this._date = _initDate(pattern);
            this._timezone = _initTimezone(pattern);
        },

        get date() {
            return this._date;
        },

        set timezone(value) {
            this._timezone = value;
        },

        get timezone() {
            return this._timezone;
        },

        // Выводит дату в переданном формате
        format: function (pattern) {
            var result = pattern;
            var date = new Date(this.date.getTime() + this.timezone * MS_PER_HOUR);
            result = result.replace(/%DD/gi, DAYS_LIST[date.getDay()]);
            result = result.replace(/%HH/gi, _addZero(date.getHours()));
            result = result.replace(/%MM/gi, _addZero(date.getMinutes()));
            return result;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var diffTime = this.date.getTime() - moment.date.getTime() +
                (this.timezone - moment.timezone) * MS_PER_HOUR;
            var infoTime = [];
            infoTime.push(parseInt(diffTime / MS_PER_DAY));
            infoTime.push(parseInt(diffTime % MS_PER_DAY / MS_PER_HOUR));
            infoTime.push(parseInt(diffTime % MS_PER_DAY % MS_PER_HOUR / MS_PER_MINUTE));
            return 'До ограбления остался ' + infoTime[0] + ' день(ей) ' + infoTime[1] +
                ' часа(ов) ' + infoTime[2] + 'минут(а)';
        }
    };
};

function _initDate(pattern) {
    if (pattern) {
        if (pattern instanceof Date) {
            return pattern;
        } else {
            return _makeDate(pattern);
        }
    } else {
        return null;
    }
}

function _initTimezone(pattern) {
    if (pattern) {
        return parseInt(pattern.substr(8, 2));
    } else {
        return null;
    }
}

function _makeDate(pattern) {
    var parseDate = {};
    parseDate.day = DAYS_LIST.indexOf(pattern.substr(0, 2));
    parseDate.hours = parseInt(pattern.substr(3, 2));
    parseDate.minutes = parseInt(pattern.substr(6, 2));
    parseDate.timezone = _initTimezone(pattern);

    var date = new Date(INIT_DATE.getTime());
    date.setDate(INIT_DATE.getDate() + (7 - INIT_DATE.getDay() + parseDate.day));
    date.setHours(parseDate.hours - parseDate.timezone, parseDate.minutes, 0, 0);

    return date;
}

function _addZero(value) {
    return (value < 10) ? '0' + value : value;
}
