import React, { useState } from 'react';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { View, Text, TouchableOpacity } from 'react-native';
import IconButton from '@mui/material/IconButton';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Dinner {
  meal: string;
}

interface CalendarProps {
  dinners: { [date: string]: Dinner };
  onAddDinner: (date: string) => void;
  onSelectDinner: (date: string) => void;
}

interface CustomDayProps {
  date: any;
  state: 'selected' | 'disabled' | 'today' | '';
  marking?: any;
  onAddDinner: (date: string) => void;
  onPress?: (date: DateData) => void;
}

const CustomDay: React.FC<CustomDayProps> = (props) => {
  const { date, state, marking, onAddDinner, onPress } = props;
  const dayTextColor = state === 'disabled' ? 'gray' : 'black';

  return (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress(date);
      }}
      style={{ alignItems: 'center', padding: 4 }}
    >
      <Text style={{ color: dayTextColor }}>{date.day}</Text>
      {marking && marking.hasDinner ? (
        <TouchableOpacity onPress={() => onPress && onPress(date)}>
          <Text style={{ fontSize: 10, color: 'green' }}>Dinner ✓</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => onAddDinner(date.dateString)}>
          <Text style={{ fontSize: 12, color: 'blue' }}>+</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const LocalCalendarComponent: React.FC<CalendarProps> = ({ dinners, onAddDinner, onSelectDinner }) => {
  // State for current month displayed in the calendar.
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]);

  // Create markedDates object from dinners.
  const markedDates: { [key: string]: any } = {};
  Object.keys(dinners).forEach((dateStr) => {
    markedDates[dateStr] = {
      hasDinner: true,
      customStyles: {
        container: {
          backgroundColor: '#d1e7dd',
          borderRadius: 4,
        },
        text: {
          color: 'black',
        },
      },
    };
  });

  // Helper to change month by an offset.
  const changeMonth = (offset: number) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + offset);
    setCurrentMonth(date.toISOString().split('T')[0]);
  };

  return (
    <View>
      {/* Calendar wrapped between left and right arrow icons */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <IconButton onClick={() => changeMonth(-1)}>
          <FaChevronLeft size={24} color="black" />
        </IconButton>
        <View style={{ flex: 1 }}>
          <RNCalendar
            key={`calendar-${currentMonth}`}
            current={currentMonth}
            onDayPress={(date: DateData) => {
              if (dinners[date.dateString]) {
                onSelectDinner(date.dateString);
              }
            }}
            markingType={'custom'}
            markedDates={markedDates}
            dayComponent={(props: any) => (
              <CustomDay
                {...props}
                onAddDinner={onAddDinner}
                onPress={(date: DateData) => {
                  if (dinners[date.dateString]) {
                    onSelectDinner(date.dateString);
                  }
                }}
              />
            )}
            theme={{
              selectedDayBackgroundColor: '#0070f3',
              todayTextColor: 'red',
              dayTextColor: 'black',
              monthTextColor: 'black',
              arrowColor: 'blue',
            }}
            onMonthChange={(month) => {
              setCurrentMonth(month.dateString);
            }}
          />
        </View>
        <IconButton onClick={() => changeMonth(1)}>
          <FaChevronRight size={24} color="black" />
        </IconButton>
      </View>
      <style jsx>{`
        .calendar {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
      `}</style>
    </View>
  );
};

export default LocalCalendarComponent;