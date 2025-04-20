import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
  days: string[];
  scheduleMap: {
    [time: string]: {
      [day: string]: string[];
    };
  };
}

const ScheduleTable: React.FC<Props> = ({ title, days, scheduleMap }) => {
  const times = Object.keys(scheduleMap).sort();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.headerRow}>
        <View style={styles.timeCell}>
          <Text style={styles.headerCell}>Time</Text>
        </View>
        {days.map((day) => (
          <View key={day} style={styles.cell}>
            <Text style={styles.headerCell}>{day}</Text>
          </View>
        ))}
      </View>

      {times.map((time) => (
        <View key={time} style={styles.row}>
          <View style={styles.timeCell}>
            <Text style={styles.timeText}>{time}</Text>
          </View>
          {days.map((day) => (
            <View key={day} style={styles.cell}>
              {(scheduleMap[time]?.[day] ?? []).map((item, index) => (
                <Text key={index} style={styles.itemText}>
                  {item}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
  },
  row: {
    flexDirection: 'row',
  },
  timeCell: {
    width: 90, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 6,
  },
  timeText: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 6,
  },
  itemText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ScheduleTable;