import * as React from 'react';
import { ErrorMessage, Label } from '../index';
import { isRequired, Optional, Value } from 'metaforms';
import { InputProps } from '../../export';
import { isBoolean, isDate, isNumber } from './utils';

const getValue = (value: Value): Optional<string> => {
  if (isDate(value)) {
    return value.toISOString();
  }

  if (isBoolean(value)) {
    return value ? 'true' : 'false';
  }
  if (isNumber(value)) {
    return `${value}`;
  }

  return value;
};

const Input = React.forwardRef((props: InputProps, ref: React.Ref<HTMLInputElement>) => {
  return (
    <div>
      {props.label && <Label fieldId={props.name} label={props.label} isRequired={isRequired(props.validation)} />}
      <input
        ref={ref}
        id={props.name}
        type={props.type}
        name={props.name}
        placeholder={props.placeholder}
        value={getValue(props.value)}
        disabled={props.disabled}
        onChange={(e) => props.update({ name: props.name, value: e.target.value, groupName: props.groupName })}
        onBlur={() => props.validate({ name: props.name })}
        inputMode={props.inputMode}
      />
      {props.errorMessage ? <ErrorMessage message={props.errorMessage} /> : null}
    </div>
  );
});

export default Input;
