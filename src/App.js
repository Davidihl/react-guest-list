import DeleteIcon from '@mui/icons-material/Delete';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {
  AppBar,
  Box,
  Button,
  Container,
  Icon,
  IconButton,
  LinearProgress,
  Paper,
  Switch,
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
  const anotherGuest = useRef(null); // Used for changing the focus on first name after first submit
  const [guests, setGuests] = useState([]); // Array to store and render the guest list
  const [firstName, setFirstName] = useState(''); // form field used for first name
  const [lastName, setLastName] = useState(''); // form field used for last name
  const [firstNameValid, setFirstNameValid] = useState(true); // validation for first name input
  const [lastNameValid, setLastNameValid] = useState(true); // validation for last name input
  const [loading, setLoading] = useState(true);

  // If the guest array changes, set loading to false
  useEffect(() => {
    console.log('loading finished');
    setTimeout;
    setLoading(false);
  }, [guests]);

  // On first load, call API and load all saved guests
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

  // Validate the input on submit
  const formValidation = async () => {
    if (firstName.length > 0) {
      if (lastName.length > 0) {
        setFirstNameValid(true);
        setLastNameValid(true);
        await addGuest();
      } else {
        setFirstNameValid(true);
        setLastNameValid(false);
      }
    } else if (lastName.length > 0) {
      setFirstNameValid(false);
      setLastNameValid(true);
    } else {
      setFirstNameValid(false);
      setLastNameValid(false);
    }
  };

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
      await formValidation();
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
      <LinearProgress
        style={{ display: loading ? 'block' : 'none' }}
        color="primary"
      />
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
              required
              helperText="First name required"
              error={!firstNameValid}
            />
            <TextField
              label="Last name"
              variant="filled"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
              className={styles.textField}
              required
              helperText="Last name required"
              error={!lastNameValid}
            />
            <Button
              variant="contained"
              size="large"
              onClick={() => formValidation()}
              color="secondary"
              className={styles.formButton}
            >
              Add guest
            </Button>
          </form>
        </Paper>
        <Paper
          position="static"
          className={`${styles.paper} ${styles.guestList}`}
        >
          Loading
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
        </Paper>
        <button onClick={() => formValidation()}>Debug</button>
      </Container>
    </Box>
  );
}
