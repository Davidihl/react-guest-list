import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {
  Button,
  Checkbox,
  FormControl,
  TextField,
  Typography,
  useScrollTrigger,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useRef, useState } from 'react';
import styles from './App.module.scss';

export default function App() {
  const anotherGuest = useRef(null);
  const [guests, setGuests] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  // Debug
  useEffect(() => {
    console.log(guests);
  }, [guests]);

  // Add user to array by clicking
  function addGuest() {
    const newGuest = [
      { firstName: name, lastName: lastName, attending: false },
    ];
    anotherGuest.current.focus();
    setGuests([...guests, newGuest]);
    setName('');
    setLastName('');
  }

  // Add user to array by pressing enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addGuest();
    }
  };

  return (
    <div className={styles.container}>
      <Typography variant="h1" gutterBottom>
        Guest List
      </Typography>
      <div data-test-id="guest" className={styles.guest}>
        Guest List Placeholder
      </div>
      <div id="form">
        <form
          className={styles.form}
          onSubmit={(event) => event.preventDefault()}
        >
          <TextField
            label="First name"
            variant="filled"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            inputRef={anotherGuest}
          />
          <TextField
            label="Last name"
            variant="filled"
            value={lastName}
            onChange={(event) => setLastName(event.currentTarget.value)}
            onKeyDown={handleKeyDown}
          />
          <Button variant="contained" size="large" onClick={() => addGuest()}>
            Add guest
          </Button>
        </form>
      </div>
    </div>
  );
}
