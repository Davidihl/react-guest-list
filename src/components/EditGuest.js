import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import styles from './EditGuest.module.scss';

function formValidation(firstName, lastName) {
  if (firstName.length > 0) {
    if (lastName.length > 0) {
      return { firstNameValid: true, lastNameValid: true };
    } else {
      return { firstNameValid: true, lastNameValid: false };
    }
  } else if (lastName.length > 0) {
    return { firstNameValid: false, lastNameValid: true };
  } else {
    return { firstNameValid: false, lastNameValid: false };
  }
}

export default function EditGuest(props) {
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [open, setOpen] = useState(false);
  const [validation, setValidation] = useState({
    firstNameValid: true,
    lastNameValid: true,
  });

  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    setOpen(false);
  }

  function handleEdit(firstName, lastName) {
    const isValid = formValidation(firstName, lastName);
    setValidation(isValid);

    if (isValid.firstNameValid === true && isValid.lastNameValid === true) {
      console.log(props.index);
      const content = { firstName: editFirst, lastName: editLast };
      props.updateGuest(props.index, content);
      setOpen(false);
    }
  }

  return (
    <>
      <IconButton onClick={() => handleOpen()}>
        <EditIcon />
      </IconButton>
      <Modal open={open} onClose={() => handleClose()} className={styles.modal}>
        <Box className={styles.dialog}>
          <Paper className={styles.form}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit Guest
            </Typography>
            <div className={styles.formFields}>
              <TextField
                label="First name"
                variant="filled"
                value={editFirst}
                className={styles.textField}
                onChange={(event) => setEditFirst(event.currentTarget.value)}
                required
                helperText={
                  validation.firstNameValid ? ' ' : 'First name required'
                }
                error={!validation.firstNameValid}
              />
              <TextField
                label="Last name"
                variant="filled"
                value={editLast}
                className={styles.textField}
                onChange={(event) => setEditLast(event.currentTarget.value)}
                required
                helperText={
                  validation.lastNameValid ? ' ' : 'Last name required'
                }
                error={!validation.lastNameValid}
              />
            </div>
            <Button
              variant="contained"
              size="large"
              onClick={() => handleEdit(editFirst, editLast, props.index)}
              color="secondary"
            >
              Edit guest
            </Button>
          </Paper>
        </Box>
      </Modal>
    </>
  );
}
