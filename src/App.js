import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {
  AppBar,
  Box,
  Button,
  Container,
  Icon,
  Paper,
  TextField,
  Toolbar,
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Icon>
            <PeopleAltIcon sx={{ paddingRight: '8px' }} />
          </Icon>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Guest list
          </Typography>
          <Button color="inherit">Clear all</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Paper position="static" className={styles.paper}>
          <Typography variant="h5" component="div">
            Add Guests
          </Typography>
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
              className={styles.textField}
            />
            <TextField
              label="Last name"
              variant="filled"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
              className={styles.textField}
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => addGuest()}
              color="secondary"
            >
              Add guest
            </Button>
          </form>
        </Paper>
      </Container>

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
    </Box>
  );
}
