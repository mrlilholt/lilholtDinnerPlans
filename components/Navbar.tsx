import React, { useState, FC } from 'react';
import { useRouter } from 'next/router';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

interface MenuItem {
  text: string;
  section: string;
}

interface NavbarProps {
  menuItems: MenuItem[];
  handleMenuClick: (sectionId: string) => void;
}

const menuItems = [
  { text: 'Upcoming Dinners', section: 'upcoming-dinners' },
  { text: 'Calendar', section: 'calendar-section' },
  { text: 'Food On Hand', section: 'food-on-hand-section' },
];

const Navbar: FC<NavbarProps> = ({ menuItems, handleMenuClick }) => {
  return (
    <List>
      {menuItems.map((item, index) => (
        <ListItem
          component="li"
          button
          key={index}
          onClick={() => handleMenuClick(item.section)}
        >
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
};

const App = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    setDrawerOpen(open);
  };

  const handleMenuClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: 'Inter, sans-serif' }}>
            Lilholt Dinner Plan Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Navbar menuItems={menuItems} handleMenuClick={handleMenuClick} />
      </Drawer>
    </>
  );
};

export default App;