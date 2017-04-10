import React, { PropTypes } from 'react';
import ErrorMessage from './ErrorMessage';
import { validationShape } from '../shapes';
import Label from './Label';
import { isRequired } from '../utils/utils';

const Textarea = ({id, groupId, label, type, placeholder, value, disabled, update, validate, errorMessage, validation}) => (
  <div className="formField">
    <Label fieldId={id} label={label} isRequired={isRequired(validation)} />
    <textarea
      id={id}
      type={type}
      placeholder={placeholder}
      defaultValue={value}
      disabled={disabled}
      onChange={e => update(id, e.target.value)}
      onBlur={() => validate(id, groupId)}
    />
    <ErrorMessage message={errorMessage}/>
  </div>
);

Textarea.propTypes = {
  id: PropTypes.string.isRequired,
  groupId: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  update: PropTypes.func.isRequired,
  validate: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  validation: PropTypes.arrayOf(validationShape)
};

Textarea.defaultProps= {
  groupId: null,
  label: '',
  placeholder: '',
  value: '',
  disabled: false,
  validation: []
};


export default Textarea;
