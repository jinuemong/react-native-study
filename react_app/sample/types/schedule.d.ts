export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI';
export type Weekend = 'SAT' | 'SUN';
export type Week = Weekday | Weekend;

export interface ScheduleEntry {
  week: Week;
  time: string;
  code: string;
}

export interface UserSchedule {
  [user: string]: ScheduleEntry[];
}

export interface GroupedSchedule {
  [time: string]: {
    [week in Week]?: string[];
  };
}

export interface GroupedResult {
  weekdays: GroupedSchedule;
  weekends: GroupedSchedule;
}