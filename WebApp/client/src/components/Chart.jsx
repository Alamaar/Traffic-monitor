
import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import Stack from '@mui/material/Stack';


export function Chart(probs) {
   const [value, setValue] =  React.useState(
    new Date()
  );

  console.log(value.toISOString())
 
  


  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
    <DateTimePicker
      renderInput={(props) => <TextField {...props} />}
      label="DateTimePicker"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
    />
  </LocalizationProvider> </div>
  ) 
}
