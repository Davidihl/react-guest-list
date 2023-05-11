import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { uid } from 'uid';
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
  const addGuest = () => {
    const newGuest = {
      uid: uid(),
      firstName: name,
      lastName: lastName,
      attends: false,
    };
    anotherGuest.current.focus();
    setGuests([...guests, newGuest]);
    setName('');
    setLastName('');
  };

  // Change attending
  const handleAttending = (event, index) => {
    const isAttending = [...guests];
    isAttending[index].attends = !isAttending[index].attends;
    setGuests(isAttending);
  };

  // Change attending
  const deleteGuest = (guestUid) => {
    const currentGuestlist = [...guests];
    const newGuestlist = currentGuestlist.filter(
      (guest) => guest.uid !== guestUid,
    );
    setGuests(newGuestlist);
  };

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
      <div className={styles.guestList}>
        {guests.map((guest, index) => {
          return (
            <div
              key={`guest-${guest.uid}`}
              data-test-id="guest"
              className={styles.guest}
            >
              <div>
                {guest.firstName} {guest.lastName}
              </div>

              <div className={styles.guestControl}>
                <span>
                  {guest.attends ? 'is attanding' : 'is not attending'}
                </span>
                <Switch
                  onClick={(event) => handleAttending(event, index)}
                  aria-label={`attending ${guest.firstName} ${guest.lastName}`}
                />
                <IconButton
                  onClick={() => deleteGuest(guest.uid)}
                  aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          );
        })}
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
