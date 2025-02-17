import React from 'react';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface DinnerItemProps {
  day: string; // Expected format: 'YYYY-MM-DD'
  meal: string;
  userIcon: string;
  onEdit?: () => void; // Optional callback when edit button is clicked.
}

const getDayAvatar = (day: string) => {
  // Append a midday time in UTC to avoid timezone issues.
  const date = new Date(day + 'T12:00:00Z');
  const dayNum = date.getUTCDay(); // 0 (Sunday) to 6 (Saturday)
  let label = '';
  switch (dayNum) {
    case 0:
      label = 'Sun';
      break;
    case 1:
      label = 'M';
      break;
    case 2:
      label = 'Tu';
      break;
    case 3:
      label = 'W';
      break;
    case 4:
      label = 'Th';
      break;
    case 5:
      label = 'F';
      break;
    case 6:
      label = 'Sat';
      break;
    default:
      label = '';
  }
  return (
    <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem', marginLeft: 1 }}>
      {label}
    </Avatar>
  );
};

const DinnerItem: React.FC<DinnerItemProps> = ({ day, meal, userIcon, onEdit }) => {
  return (
    <>
      <ListItem className="dinner-item">
        <ListItemAvatar>
          <Avatar src={userIcon} alt="User Icon" />
        </ListItemAvatar>
        <ListItemText
          primary={meal}
          secondary={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>{day}</span>
              {getDayAvatar(day)}
            </div>
          }
        />
        {onEdit && (
          <ListItemSecondaryAction>
            <IconButton edge="end" onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <style jsx>{`
        .dinner-item {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
      `}</style>
    </>
  );
};

export default DinnerItem;