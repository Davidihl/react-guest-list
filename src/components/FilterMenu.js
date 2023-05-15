import { Button, Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useEffect, useState } from 'react';
import styles from './FilterMenu.module.scss';

export default function FilterMenu(props) {
  const [filter, setFilter] = useState('');

  async function resetFilter() {
    props.setLoading(true);
    const response = await fetch(`${props.baseUrl}/guests`);
    const allGuests = await response.json();
    props.setGuests(allGuests);
    props.setFilterAmount(0);
  }

  async function selectFilter() {
    props.setLoading(true);
    const response = await fetch(`${props.baseUrl}/guests`);
    const allGuests = await response.json();

    if (filter === 'attending') {
      const filteredGuests = allGuests.filter(
        (guest) => guest.attending === true,
      );
      console.log(filteredGuests);
      props.setGuests(filteredGuests);
      props.setFilterAmount(1);
    } else if (filter === 'notAttending') {
      const filteredGuests = allGuests.filter(
        (guest) => guest.attending === false,
      );
      props.setGuests(filteredGuests);
      props.setFilterAmount(1);
    }
  }

  useEffect(() => {
    async function runFilter() {
      props.setLoading(true);
      const response = await fetch(`${props.baseUrl}/guests`);
      const allGuests = await response.json();

      if (filter === 'attending') {
        const filteredGuests = allGuests.filter(
          (guest) => guest.attending === true,
        );
        props.setGuests(filteredGuests);
        props.setFilterAmount(1);
      } else if (filter === 'notAttending') {
        const filteredGuests = allGuests.filter(
          (guest) => guest.attending === false,
        );
        props.setGuests(filteredGuests);
        props.setFilterAmount(1);
      } else if (filter === 'none') {
        props.setGuests(allGuests);
      }
      props.setShowFilter(false);
    }

    runFilter().catch((error) => {
      console.log(error);
    });
  }, [filter]);

  return (
    <Paper
      elevation={6}
      className={`${styles.filterMenu} ${
        props.showFilter ? '' : styles.hidden
      }`}
    >
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">Filter by</FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
        >
          <FormControlLabel
            value="attending"
            control={<Radio />}
            label="attending"
            onChange={() => {
              setFilter('attending');
            }}
          />
          <FormControlLabel
            value="not attending"
            control={<Radio />}
            label="not attending"
            onChange={() => {
              setFilter('notAttending');
            }}
          />
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="none"
            onChange={() => {
              setFilter('none');
            }}
          />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}
