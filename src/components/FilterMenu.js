import { Paper } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import styles from './FilterMenu.module.scss';

export default function FilterMenu(props) {
  return (
    <Paper
      elevation={6}
      className={`${styles.filterMenu} ${
        props.showFilter ? '' : styles.hidden
      }`}
    >
      <FormControl>
        <FormLabel id="Filter">Filter by</FormLabel>
        <RadioGroup aria-label="filter group" name="filter group">
          <FormControlLabel
            value="attending"
            control={<Radio />}
            label="attending"
            onChange={() => {
              props.setFilter('attending');
            }}
          />
          <FormControlLabel
            value="not attending"
            control={<Radio />}
            label="not attending"
            onChange={() => {
              props.setFilter('notAttending');
            }}
          />
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="none"
            onChange={() => {
              props.setFilter('none');
            }}
          />
        </RadioGroup>
      </FormControl>
    </Paper>
  );
}
