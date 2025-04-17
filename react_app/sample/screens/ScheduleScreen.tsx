import React from 'react';
import { ScrollView } from 'react-native';
import ScheduleTable from './components/ScheduleTable';
import scheduleData from '../data/schedule/sampleSchedule.json';
import { groupScheduleByTime } from '../utils/groupScheduleByTime';
import { Weekday, Weekend } from '../types/schedule';

const ScheduleScreen = () => {
  const { weekdays, weekends } = groupScheduleByTime(scheduleData.USER);

  const weekdayOrder: Weekday[] = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const weekendOrder: Weekend[] = ['SAT', 'SUN'];

  return (
    <ScrollView>
      <ScheduleTable title="평일" days={weekdayOrder} scheduleMap={weekdays} />
      <ScheduleTable title="주말" days={weekendOrder} scheduleMap={weekends} />
    </ScrollView>
  );
};

export default ScheduleScreen;