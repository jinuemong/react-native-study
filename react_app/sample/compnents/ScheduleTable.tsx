import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Week, GroupedSchedule } from '../types/schedule';

interface Props {
  title: string;
  days: Week[];
  scheduleMap: GroupedSchedule;
}

const ScheduleTable: React.FC<Props> = ({ title, days, scheduleMap }) => {
  const times = Object.keys(scheduleMap).sort();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Time</Text>
        {days.map((day) => (
          <Text key={day} style={styles.headerCell}>{day}</Text>
        ))}
      </View>
      {times.map((time) => (
        <View key={time} style={styles.row}>
          <Text style={styles.cell}>{time}</Text>
          {days.map((day) => (
            <Text key={day} style={styles.cell}>
              {scheduleMap[time]?.[day]?.join(', ') ?? ''}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#f9f9f9', marginVertical: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 4 },
  headerCell: { flex: 1, fontWeight: '600', textAlign: 'center' },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, paddingVertical: 6 },
  cell: { flex: 1, textAlign: 'center' },
});

export default ScheduleTable;