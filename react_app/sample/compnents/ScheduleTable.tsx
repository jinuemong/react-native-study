// src/components/ScheduleTable.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Weekday, ScheduleSlot } from '.types/schedule';

interface Props {
  title: string;
  days: Weekday[];
  scheduleMap: Record<string, Record<Weekday, string[]>>;
}

const ScheduleTable: React.FC<Props> = ({ title, days, scheduleMap }) => {
  const times = Object.keys(scheduleMap).sort(); // 시간 정렬

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
  container: { padding: 10, marginVertical: 10, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1 },
  headerCell: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  row: { flexDirection: 'row', borderBottomWidth: 0.5, paddingVertical: 4 },
  cell: { flex: 1, textAlign: 'center' },
});

export default ScheduleTable;