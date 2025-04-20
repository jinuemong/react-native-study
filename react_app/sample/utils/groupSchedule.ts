import {
  GroupedResult,
  GroupedSchedule,
  UserSchedule,
  Weekday,
} from '../types/schedule';

const weekdays: Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];

export const groupScheduleByTime = (users: UserSchedule): GroupedResult => {
  const weekdaysResult: GroupedSchedule = {};
  const weekendsResult: GroupedSchedule = {};

  Object.entries(users).forEach(([user, schedules]) => {
    schedules.forEach((entry) => {
      const target = weekdays.includes(entry.week as Weekday)
        ? weekdaysResult
        : weekendsResult;

      if (!target[entry.time]) {
        target[entry.time] = {};
      }
      if (!target[entry.time][entry.week]) {
        target[entry.time][entry.week] = [];
      }

      target[entry.time][entry.week]!.push(user);
    });
  });

  return {
    weekdays: weekdaysResult,
    weekends: weekendsResult,
  };
};