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
  const firstNameInputRef = useRef(null); // Used for changing the focus on first name after first submit
  const [guests, setGuests] = useState([]); // Array to store and render the guest list
  const [firstName, setFirstName] = useState(''); // form field used for first name
  const [lastName, setLastName] = useState(''); // form field used for last name
  const [firstNameValid, setFirstNameValid] = useState(true); // validation for first name input
  const [lastNameValid, setLastNameValid] = useState(true); // validation for last name input
  const [loading, setLoading] = useState(true);

  // If the guest array changes, set loading to false
  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // setTimeout is used to "fake" a delayed response for displaying the loading indicator
    }, 0);
  }, [guests]);

  // On first load, call API and load all saved guests
  useEffect(() => {
    async function getAllGuests() {
      setLoading(true);
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
    setLoading(true);
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
    setTimeout(() => {
      firstNameInputRef.current.focus(); // Timeout used to make sure the focus is changed after Buttons were disabled
    }, 10);
    setFirstName('');
    setLastName('');
  }

  // API update attending
  async function handleAttending(index) {
    setLoading(true);
    const response = await fetch(`${baseUrl}/guests/${guests[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !guests[index].attending }),
    });
    const updatedGuest = await response.json();
    const isAttending = [...guests];
    isAttending[index].attending = updatedGuest.attending;
    setGuests(isAttending);
  }

  // API delete user
  async function deleteGuest(guestId) {
    setLoading(true);
    const response = await fetch(`${baseUrl}/guests/${guestId}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const currentGuestlist = [...guests];
    const newGuestlist = currentGuestlist.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuests(newGuestlist);
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
              inputRef={firstNameInputRef}
              className={styles.textField}
              required
              helperText={firstNameValid ? ' ' : 'First name required'}
              error={!firstNameValid}
              disabled={loading}
            />
            <TextField
              label="Last name"
              variant="filled"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              onKeyDown={handleKeyDown}
              className={styles.textField}
              required
              helperText={lastNameValid ? ' ' : 'Last name required'}
              error={!lastNameValid}
              disabled={loading}
            />
            <div className={styles.formButton}>
              <Button
                variant="contained"
                size="large"
                onClick={() => formValidation()}
                color="secondary"
                disabled={loading}
              >
                Add guest
              </Button>
            </div>
          </form>
        </Paper>
        <Paper position="static" className={styles.paper}>
          <Typography variant="h5" component="div">
            {guests.length === 0 ? 'Guest List Empty' : 'Guest List'}
          </Typography>
          {loading ? 'Loading...' : ''}
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
                      {guest.attending ? 'is attending' : 'is not attending'}
                    </span>
                    <Switch
                      checked={guest.attending}
                      onClick={() => handleAttending(index)}
                      aria-label={`attending ${guest.firstName} ${guest.lastName}`}
                      disabled={loading}
                    />
                    <IconButton
                      onClick={() => deleteGuest(guest.id)}
                      aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </Paper>
      </Container>
    </Box>
  );
}
