import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import {
  AppBar,
  Badge,
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
import EditGuest from './components/EditGuest';
import FilterMenu from './components/FilterMenu';

export default function App() {
  // API configuration
  const baseUrl = 'https://5227b541-5650-4cb9-9fa2-0f82d9aace3c.id.repl.co';

  // Guest list variables
  const firstNameInputRef = useRef(null); // Used for changing the focus on first name after first submit
  const [guests, setGuests] = useState([]); // Array to store and render the guest list
  const [firstName, setFirstName] = useState(''); // form field used for first name
  const [lastName, setLastName] = useState(''); // form field used for last name
  const [firstNameValid, setFirstNameValid] = useState(true); // validation for first name input
  const [lastNameValid, setLastNameValid] = useState(true); // validation for last name input
  const [loading, setLoading] = useState(true); // trigger to show loading animation/information
  const [showFilterMenu, setShowFilterMenu] = useState(false); // variable to show the filter menu
  const [filterAmount, setFilterAmount] = useState(0); // if a filter is set, show it next to the icon
  const [filter, setFilter] = useState('none'); // indicator for when there is a filter set

  function handleFilter() {
    const showMenu = showFilterMenu;
    setShowFilterMenu(!showMenu);
  }

  // If the guest array changes, set loading to false
  useEffect(() => {
    setLoading(false);
  }, [guests]);

  // On first load, and if filter changes call API and load all saved guests
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

  // Filter the array
  useEffect(() => {
    async function runFilter() {
      setLoading(true);
      const response = await fetch(`${baseUrl}/guests`); // Fetch all the users, to make sure that while switching filters,
      const allGuests = await response.json(); // new users get considered too!

      if (filter === 'attending') {
        const filteredGuests = allGuests.filter(
          (guest) => guest.attending === true,
        );
        setGuests(filteredGuests); // filter for attending guests
        setFilterAmount(1); // show that a filter is used
      } else if (filter === 'notAttending') {
        const filteredGuests = allGuests.filter(
          (guest) => guest.attending === false,
        );
        setGuests(filteredGuests); // filter for not attending guests
        setFilterAmount(1); // show that a filter is used
      } else if (filter === 'none') {
        setGuests(allGuests); // remove filter, show the whole array
        setFilterAmount(0); // remove filter indicator
      }
      setShowFilterMenu(false);
    }

    runFilter().catch((error) => {
      console.log(error);
    });
  }, [filter]);

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
    setTimeout(() => {
      setGuests([...guests, createdGuest]);
    }, 0);
    setTimeout(() => {
      firstNameInputRef.current.focus(); // Timeout used to make sure the focus is changed after Buttons were disabled
    }, 10);
    setFirstName('');
    setLastName('');
  }

  // API update entry
  async function updateGuest(index, content) {
    const response = await fetch(`${baseUrl}/guests/${guests[index].id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });
    const updatedGuest = await response.json();
    const updatedGuestList = [...guests];
    updatedGuestList[index] = updatedGuest;
    setGuests(updatedGuestList);
  }

  // API delete user
  async function deleteGuest(guestId) {
    const response = await fetch(`${baseUrl}/guests/${guestId}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const currentGuestList = [...guests];
    const newGuestList = currentGuestList.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuests(newGuestList);
  }

  // API delete all
  function deleteAll() {
    setLoading(true);
    setFilter('none'); // Remove filter

    async function getAllGuests() {
      setLoading(true);
      const response = await fetch(`${baseUrl}/guests`);
      const allGuests = await response.json();
      for (const guest of allGuests) {
        await deleteGuest(guest.id);
      }
    }

    getAllGuests().catch((error) => {
      console.log(error);
    });
    setGuests([]);
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
          <Button
            color="inherit"
            onClick={() => {
              setFilter('none');
              deleteAll();
            }}
          >
            Clear all
          </Button>
        </Toolbar>
      </AppBar>

      <div className={styles.wrapper}>
        <div className={styles.loadingBar}>
          <LinearProgress
            style={{ display: loading ? 'block' : 'none' }}
            color="primary"
          />
        </div>
      </div>

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
          <div className={styles.guestListHeader}>
            <Typography variant="h5" component="div">
              {guests.length === 0 ? 'Guest List Empty' : 'Guest List'}
            </Typography>
            <Toolbar>
              <IconButton onClick={() => handleFilter()}>
                <Badge badgeContent={filterAmount} color="primary" hidden>
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Toolbar>
            <FilterMenu
              showFilter={showFilterMenu}
              setShowFilter={setShowFilterMenu}
              filter={filter}
              setFilter={setFilter}
            />
          </div>
          {loading ? (
            <div data-test-id="guest" className={styles.loading}>
              Loading...
            </div>
          ) : (
            ''
          )}
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
                      onClick={() =>
                        updateGuest(index, { attending: !guest.attending })
                      }
                      aria-label={`${guest.firstName} ${guest.lastName} attending ${guest.attending}`} // this wont pass drone
                      inputProps={{
                        'aria-label': `${guest.firstName} ${guest.lastName} attending ${guest.attending}`, // this will
                      }}
                      disabled={loading}
                    />
                    <EditGuest
                      index={index}
                      updateGuest={updateGuest}
                      firstName={guest.firstName}
                      lastName={guest.lastName}
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
