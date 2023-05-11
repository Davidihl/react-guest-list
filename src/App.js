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
import styles from './App.module.scss';

export default function App() {
  // API configuration
  const baseUrl = 'http://localhost:4000';

  // Guest list variables
  const anotherGuest = useRef(null);
  const [guests, setGuests] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // API get all users on load
  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();

      setGuests(allGuests);
    }

    getAllGuests().catch((error) => {
      console.log(error);
    });
  }, []);

  // API create user
  async function addGuest() {
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
      }),
    });
    const createdGuest = await response.json();
    setGuests([...guests, createdGuest]);
    anotherGuest.current.focus();
    setFirstName('');
    setLastName('');
  }

  // Change attending
  // const handleAttending = (event, index) => {
  //   const isAttending = [...guests];
  //   isAttending[index].attends = !isAttending[index].attends;
  //   setGuests(isAttending);
  // };

  // Deleate guest
  // const deleteGuest = (guestUid) => {
  //   const currentGuestlist = [...guests];
  //   const newGuestlist = currentGuestlist.filter(
  //     (guest) => guest.uid !== guestUid,
  //   );
  //   setGuests(newGuestlist);
  // };

  // Add user to array by pressing enter
  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      await addGuest();
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
              key={`guest-${guest.id}`}
              data-test-id="guest"
              className={styles.guest}
            >
              <div>
                {guest.firstName} {guest.lastName}
              </div>

              <div className={styles.guestControl}>
                <span>
                  {guest.attends ? 'is attending' : 'is not attending'}
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
            value={firstName}
            onChange={(event) => setFirstName(event.currentTarget.value)}
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
