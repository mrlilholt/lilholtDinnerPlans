import React, { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { 
  Button, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { FaTrash, FaEdit } from 'react-icons/fa';

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
}

const categoryOptions = [
  { value: 'Vegetables', label: 'Vegetables' },
  { value: 'Dinner', label: 'Dinner' },
  { value: 'Breakfast', label: 'Breakfast' },
  { value: 'Dessert', label: 'Dessert' },
  { value: 'Misc', label: 'Misc' },
];

const FoodOnHand: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [newFoodName, setNewFoodName] = useState('');
  const [newQuantity, setNewQuantity] = useState<number>(1);
  const [newCategory, setNewCategory] = useState<string>('Misc');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingQuantity, setEditingQuantity] = useState<number>(0);
  const [editingCategory, setEditingCategory] = useState<string>('');

  const db = firebase.firestore();

  // Subscribe to foodOnHand collection in Firestore
  useEffect(() => {
    const unsubscribe = db
      .collection('foodOnHand')
      .orderBy('createdAt')
      .onSnapshot((snapshot) => {
        const foods: FoodItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Food document data:', data);
          foods.push({
            id: doc.id,
            name: data.name,
            quantity: data.quantity,
            category: data.category,
          });
        });
        setFoodItems(foods);
      });
    return () => unsubscribe();
  }, [db]);

  // Add new food item to Firestore
  const handleAddFood = async () => {
    if (!newFoodName.trim() || newQuantity <= 0) return;
    await db.collection('foodOnHand').add({
      name: newFoodName.trim(),
      quantity: newQuantity,
      category: newCategory,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setNewFoodName('');
    setNewQuantity(1);
    setNewCategory('Misc');
  };

  // Remove a food item from Firestore
  const handleRemoveFood = async (id: string) => {
    await db.collection('foodOnHand').doc(id).delete();
  };

  // Update quantity and category for a food item
  const handleUpdateFood = async (id: string) => {
    if (editingQuantity < 0 || isNaN(editingQuantity)) return;
    await db.collection('foodOnHand').doc(id).update({
      quantity: editingQuantity,
      category: editingCategory,
    });
    setEditingId(null);
    setEditingQuantity(0);
    setEditingCategory('');
  };

  // Filter food items based on selected category
  const filteredFoodItems =
    filterCategory === 'All'
      ? foodItems
      : foodItems.filter((item) => item.category === filterCategory);

  return (
    <div className="food-on-hand">
      <h2>Food On Hand</h2>
      {/* Add New Food Form */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <TextField
          label="Food Item"
          value={newFoodName}
          onChange={(e) => setNewFoodName(e.target.value)}
        />
        <TextField
          label="Quantity"
          type="number"
          value={newQuantity}
          onChange={(e) => {
            const qty = parseInt(e.target.value, 10);
            setNewQuantity(isNaN(qty) ? 1 : qty);
          }}
          inputProps={{ min: 1 }}
          sx={{ width: '100px' }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="new-food-category-label">Category</InputLabel>
          <Select
            labelId="new-food-category-label"
            value={newCategory}
            label="Category"
            onChange={(e) => setNewCategory(e.target.value)}
          >
            {categoryOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddFood}>
          Add Food
        </Button>
      </div>
      {/* Filter Dropdown */}
      <FormControl sx={{ minWidth: 150, marginBottom: '1rem' }}>
        <InputLabel id="filter-category-label">Filter Category</InputLabel>
        <Select
          labelId="filter-category-label"
          value={filterCategory}
          label="Filter Category"
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          {categoryOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* Food List */}
      <List>
        {filteredFoodItems.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={`${item.name} (${item.category})`}
              secondary={`Quantity: ${item.quantity}`}
            />
            {editingId === item.id ? (
              <>
                <TextField
                  type="number"
                  value={editingQuantity}
                  onChange={(e) => {
                    const qty = parseInt(e.target.value, 10);
                    setEditingQuantity(isNaN(qty) ? 0 : qty);
                  }}
                  sx={{ width: '80px', marginRight: '0.5rem' }}
                />
                <FormControl sx={{ minWidth: 120, marginRight: '0.5rem' }}>
                  <InputLabel id="edit-food-category-label">Category</InputLabel>
                  <Select
                    labelId="edit-food-category-label"
                    value={editingCategory || item.category}
                    label="Category"
                    onChange={(e) => setEditingCategory(e.target.value)}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdateFood(item.id)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <IconButton
                  edge="end"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditingQuantity(item.quantity);
                    setEditingCategory(item.category);
                  }}
                >
                  <FaEdit />
                </IconButton>
                <IconButton edge="end" onClick={() => handleRemoveFood(item.id)}>
                  <FaTrash />
                </IconButton>
              </>
            )}
          </ListItem>
        ))}
      </List>
      <style jsx>{`
        .food-on-hand {
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
      `}</style>
    </div>
  );
};

export default FoodOnHand;