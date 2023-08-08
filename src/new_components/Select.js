import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import { IconButton } from '@mui/material';
import Close from '@mui/icons-material/Close';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    width: 250,
    borderRadius: 100,
    background: '#111',
    marginBottom: '25px',

    '&.selected': {
      background: ' #d2f200',
      '& .MuiInputBase-input': {
        color: '#111 !important',
        fontWeight: 'bold',
      }
    },

    '& .MuiFormLabel-root': {
      top: '-8px',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& label.Mui-focused': {
      color: 'white',
      top: '-8px',
      left: '10px',
      fontSize: '15px',
    }
  },
  close: {
    position: 'absolute !important',
  }
}));

const BasicSelect = props => {
  const classes = useStyles();
  const [value, setValue] = React.useState('');

  const handleChange = e => {
    let f = {...props.filters};
    f[props.name] = e.target.value;
    if(e.target.value === '')
      delete f[props.name];
    if(props.name === 'Respuestas'){
      f[props.name] = e.target.value.split(' ').slice(1).join(' ');
      if(e.target.value === '')
        delete f[props.name];
    }
    props.setFilters(f);
    setValue(e.target.value);
  }

  return (
    <Box
      className={`${classes.root} ${value !== '' ? 'selected' : ''}`}
    >
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.name}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={props.name}
          size="small"
          onChange={handleChange}
        >
          {props.list.map((item, index) => {
            return (
              <MenuItem value={item}>{item}</MenuItem>
            )
          })}

        </Select>
      </FormControl>

      {value !== '' &&
        <IconButton
          className={classes.close}
          onClick={() => handleChange({target: {value: ''}})}
        >
          <Close />
        </IconButton>
      }

    </Box>
  );
}

export default BasicSelect;