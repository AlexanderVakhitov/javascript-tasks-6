'use strict';

var moment = require('./moment');
var WORK_WEEK = ['ПН', 'ВТ', 'СР'];

// Выбирает подходящий ближайший момент начала ограбления
module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var schedule = JSON.parse(json);
    var timeLine = [];

    Object.keys(schedule).forEach(function (member) {
        schedule[member].forEach(function (time) {
            timeLine.push({
                moment: moment(time.from),
                free: false
            });
            timeLine.push({
                moment: moment(time.to),
                free: true
            });
        });
    });

    WORK_WEEK.forEach(function (day) {
        timeLine.push({
            moment: moment(day + ' ' + workingHours.from),
            free: true
        });
        timeLine.push({
            moment: moment(day + ' ' + workingHours.to),
            free: false
        });
    });

    timeLine.sort(function (a, b) {
        return a.moment.date - b.moment.date;
    });

    var freeMembers = Object.keys(schedule).length;
    var needToHeist = freeMembers + 1;
    for (var i = 0; i < timeLine.length; ++i) {
        if (timeLine[i].free) {
            ++freeMembers;
        } else {
            --freeMembers;
        }
        if (freeMembers === needToHeist) {
            for (var j = i + 1; j < timeLine.length; ++j) {
                var freeTime =
                    timeLine[j].moment.date.getTime() - timeLine[i].moment.date.getTime();
                if ((freeTime - minDuration * 60 * 1000) >= 0) {
                    return timeLine[i].moment;
                }
                if (!timeLine[j].free) {
                    break;
                }
            }
        }
    }
};

// Возвращает статус ограбления (этот метод уже готов!)
module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
