import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { auth, logout } from '../firebase/auth';
import type { User } from '../firebase/auth';
import DinnerItem from '../components/DinnerItem';
import Navbar from '../components/Navbar';
import LilholtDinnerPlanLogo from '../assets/images/LilholtDinnerPlanLogo.png';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FoodOnHand from '../components/FoodOnHand';

// Dynamically import Calendar to disable SSR
const Calendar = dynamic(() => import('../components/Calendar'), { ssr: false });

type DinnerPlanItem = {
  id: string;
  day: string;
  meal: string;
  userIcon: string;
};

const Dashboard = () => {
  const [dinnerPlan, setDinnerPlan] = useState<DinnerPlanItem[]>([]);
  const [foodOnHand, setFoodOnHand] = useState<string[]>([]);
  const [newFood, setNewFood] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [editingMeal, setEditingMeal] = useState('');
  const [editingDinnerId, setEditingDinnerId] = useState<string | null>(null);

  const router = useRouter();
  const db = firebase.firestore();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
      } else {
        router.push('/login');
      }
    });

    // Subscribe to dinnerPlan collection
    const unsubscribeDinnerPlan = db
      .collection('dinnerPlan')
      .orderBy('day')
      .onSnapshot((snapshot) => {
        const dinners: DinnerPlanItem[] = [];
        snapshot.forEach((doc) => {
          dinners.push({
            id: doc.id,
            day: doc.data().day,
            meal: doc.data().meal,
            userIcon: doc.data().userIcon,
          });
        });
        setDinnerPlan(dinners);
      });

    // Subscribe to foodOnHand collection
    const unsubscribeFoodOnHand = db
      .collection('foodOnHand')
      .orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const foods: string[] = [];
        snapshot.forEach((doc) => {
          foods.push(doc.data().text);
        });
        setFoodOnHand(foods);
      });

    return () => {
      unsubscribeAuth();
      unsubscribeDinnerPlan();
      unsubscribeFoodOnHand();
    };
  }, []);

  // Open dialog when a day is clicked
  const openDinnerDialog = (dateString: string) => {
    setSelectedDate(dateString);
    const existingDinner = dinnerPlan.find((item) => item.day === dateString);
    if (existingDinner) {
      setEditingMeal(existingDinner.meal);
      setEditingDinnerId(existingDinner.id);
    } else {
      setEditingMeal('');
      setEditingDinnerId(null);
    }
    setDialogOpen(true);
  };

  // Save dinner: either update or create new document.
  const handleDinnerSave = async () => {
    if (editingMeal.trim() === '') return;
    if (editingDinnerId) {
      await db.collection('dinnerPlan').doc(editingDinnerId).update({
        meal: editingMeal.trim(),
        userIcon: user?.photoURL || '/user-icons/default.png',
      });
    } else {
      await db.collection('dinnerPlan').add({
        day: selectedDate,
        meal: editingMeal.trim(),
        userIcon: user?.photoURL || '/user-icons/default.png',
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setDialogOpen(false);
  };

  const addFoodItem = async () => {
    if (newFood.trim()) {
      await db.collection('foodOnHand').add({
        text: newFood.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setNewFood('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err: any) {
      console.error('Logout failed:', err.message);
    }
  };

  // When a day is clicked in the Calendar, open the dinner dialog.
  const handleDaySelect = async (dateString: string) => {
    openDinnerDialog(dateString);
  };

  return (
    <div className="dashboard">
      <Navbar />
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-container">
            <Image src={LilholtDinnerPlanLogo} alt="Logo" width={100} height={100} />
          </div>
          <h1>Weekly Dinner Plan</h1>
        </div>
        <div className="header-right">
          {user && (
            <Avatar
              src={user?.photoURL || undefined}
              alt={user?.displayName || 'User'}
              sx={{ marginRight: '1rem' }}
            >
              {!user?.photoURL && user?.displayName?.[0]}
            </Avatar>
          )}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      {/* Upper Section: Upcoming Dinners and Calendar */}
      <div className="upper-section">
        <section id="upcoming-dinners" className="upcoming-dinners">
          <h2>Upcoming Dinners</h2>
          {dinnerPlan.slice(0, 7).map((item) => (
            <DinnerItem
              key={item.id}
              meal={item.meal}
              userIcon={item.userIcon}
              day={item.day}
            />
          ))}
        </section>
        <section id="calendar-section" className="calendar-section">
          <h2>Choose a Day</h2>
          <Calendar
            dinners={dinnerPlan.reduce((acc: { [key: string]: any }, curr) => {
              acc[curr.day] = { meal: curr.meal };
              return acc;
            }, {})}
            onAddDinner={handleDaySelect}
            onSelectDinner={handleDaySelect}
          />
        </section>
      </div>
      {/* Food on Hand Section */}
      <section id="food-on-hand-section" className="food-on-hand-section">
        <FoodOnHand />
      </section>
      {/* Dinner Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{editingDinnerId ? 'Update Dinner' : 'Add Dinner'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Dinner Meal"
            fullWidth
            value={editingMeal}
            onChange={(e) => setEditingMeal(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDinnerSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <style jsx>{`
        .dashboard {
          padding: 2rem;
          background: #f4f4f4;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          background: #fff;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .header-right {
          display: flex;
          align-items: center;
        }
        .logo-container {
          border: 1px solid #ccc;
          padding: 0.5rem;
          border-radius: 50%;
          background: #fff;
        }
        h1 {
          margin: 0;
          font-size: 1.8rem;
        }
        h2 {
          font-size: 1.4rem;
          margin-bottom: 1rem;
        }
        /* Upper section: flex layout for desktop, column for mobile */
        .upper-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .upper-section {
            flex-direction: row;
          }
          .upcoming-dinners,
          .calendar-section {
            flex: 1;
          }
          .upcoming-dinners {
            margin-right: 1rem;
          }
          .calendar-section {
            margin-left: 1rem;
          }
        }
        section {
          background: #fff;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 0.5rem;
          padding: 0.5rem;
          border-bottom: 1px solid #eaeaea;
        }
        .food-input {
          display: flex;
          margin-top: 1rem;
        }
        .food-input input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          margin-right: 0.5rem;
        }
        .food-input button {
          padding: 0.5rem 1rem;
          border: none;
          background: #0070f3;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .food-input button:hover {
          background: #005bb5;
        }
        .logout-button {
          padding: 0.5rem 1rem;
          border: none;
          background: #e63946;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
        }
        .logout-button:hover {
          background: #d62828;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;