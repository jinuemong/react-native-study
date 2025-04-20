import React from 'react';
import { ScrollView } from 'react-native';
import ScheduleTable from '../compnents/ScheduleTable';
import scheduleJson from '../data/schedule.json';
import { groupScheduleByTime } from '../utils/groupSchedule';
import { Weekday, Weekend, UserSchedule } from '../types/schedule';

function ScheduleScreen() {
    const users = scheduleJson.TOTAL.KR.USER as UserSchedule;
    const { weekdays, weekends } = groupScheduleByTime(users);

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