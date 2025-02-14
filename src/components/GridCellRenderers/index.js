import { forwardRef, useImperativeHandle, useState } from "react";
import { MenuItem, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import NumberFormat from "react-number-format";

const useStyles = makeStyles({
  select: {
    height: "30px",
  },
  selectInput: {
    borderRadius: 0,
    fontSize: 14,
    height: "30px",
  },
});

export const SelectRenderer = forwardRef((props, ref) => {
  const classes = useStyles();

  const [value, setValue] = useState(props.value);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  const onChange = (event) => {
    props.setValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <TextField
      select
      fullWidth
      InputProps={{ classes: { root: classes.selectInput } }}
      classes={{ root: classes.select }}
      ref={ref}
      value={value}
      onChange={onChange}
    >
      {props.options.map((option) => (
        <MenuItem value={option.value}>{option.label}</MenuItem>
      ))}
    </TextField>
  );
});

export const InputNumericRenderer = forwardRef((props, ref) => {
  const classes = useStyles();

  const [value, setValue] = useState(props.value);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    };
  });

  return (
    <NumberFormat
      value={value}
      thousandSeparator={true}
      allowNegative={false}
      allowLeadingZeros={false}
      onValueChange={(values, sourceInfo) => {
        props.setValue(values.floatValue);
        setValue(values.floatValue);
      }}
      prefix={props.noPrefix ? "" : "C$"}
      className="some"
      inputmode="numeric"
    />
  );
});