import * as React from 'react';
import { mount } from 'enzyme';
import { FieldType } from 'metaforms';

import { Form, Input } from '../index';
import Checkbox from '../fields/Checkbox';
import Textarea from '../fields/Textarea';
import { CustomComponentProps } from '../../export';

describe('<Form />', () => {
  const app = (
    fields: FieldType[],
    onSubmit: any = () => null,
    getComponent?: (props: CustomComponentProps) => React.ReactNode,
  ) => {
    type Props = {
      id: string;
      fields: FieldType[];
      getComponent?: (props: CustomComponentProps) => React.ReactNode;
      onSubmit: (fields: FieldType[]) => void;
    };

    const App: React.FC<Props> = (props) => {
      const [stateFields, onFieldsChange] = React.useState<FieldType[]>(props.fields);
      return <Form onFieldsChange={onFieldsChange} {...props} fields={stateFields} />;
    };

    return mount(<App id="testFormId" {...{ getComponent, fields, onSubmit }} />);
  };

  it('should render and update a field', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
      },
    ] as FieldType[];
    const wrapper = app(fields);

    const newValue = 'My new value';
    wrapper.find('input').simulate('change', { target: { value: newValue } });

    expect(wrapper.find(Input).props().value).toEqual(newValue);
    wrapper.unmount();
  });

  it('should update default value to empty string', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: 'some default value',
      },
    ] as FieldType[];

    const wrapper = app(fields);
    wrapper.find('input').simulate('change', { target: { value: 'ee' } });

    expect(wrapper.find('input').props().value).toEqual('ee');
    wrapper.unmount();
  });

  it('should submit the default values', () => {
    const onSubmit = jest.fn();
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: 'some default value',
      },
      {
        name: 'submitBtn',
        label: 'Submit',
        type: 'submit',
      },
    ] as FieldType[];
    const wrapper = app(fields, onSubmit);

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(fields);
    wrapper.unmount();
  });

  it('should validate', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: [
          {
            type: 'required',

            message: 'Please choose a username',
          },
        ],
      },
    ] as FieldType[];
    const wrapper = app(fields);

    wrapper.find('input').simulate('blur');

    expect(wrapper.find(Input).prop('errorMessage')).toEqual('Please choose a username');
    wrapper.unmount();
  });

  it('should updateAndValidate', () => {
    const onSubmit = jest.fn();
    const message = 'Check this checkbox';
    const fields = [
      {
        name: 'name',
        type: 'checkbox',
        label: 'Name',
        validation: [
          {
            type: 'required',
            message,
          },
        ],
      },
      {
        name: 'submit',
        type: 'submit',
      },
    ] as FieldType[];

    const wrapper = app(fields, onSubmit);

    expect(wrapper.find(Checkbox).prop('errorMessage')).toEqual(undefined);

    wrapper.find('form').simulate('submit');
    expect(onSubmit).not.toHaveBeenCalled();

    expect(wrapper.find(Checkbox).prop('errorMessage')).toEqual(message);

    wrapper.find('input').simulate('change', { target: { checked: true } });

    expect(wrapper.find(Checkbox).prop('errorMessage')).toEqual(undefined);

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(fields.map((d) => (d.name === 'name' ? { ...d, value: true } : d)));
    wrapper.unmount();
  });

  it('should render textarea', () => {
    const onSubmit = jest.fn();
    const message = 'Fill this textarea';
    const value = 'some content';
    const fields = [
      {
        name: 'name',
        type: 'textarea',
        label: 'Name',
        validation: [
          {
            type: 'required',
            message,
          },
        ],
      },
      {
        name: 'submit',
        type: 'submit',
      },
    ] as FieldType[];

    const wrapper = app(fields, onSubmit);

    expect(wrapper.find(Textarea).prop('errorMessage')).toEqual(undefined);

    wrapper.find('form').simulate('submit');
    expect(onSubmit).not.toHaveBeenCalled();

    expect(wrapper.find(Textarea).prop('errorMessage')).toEqual(message);

    wrapper.find('textarea').simulate('change', { target: { value } });
    wrapper.find('textarea').simulate('blur');

    expect(wrapper.find(Textarea).prop('errorMessage')).toEqual(undefined);

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(fields.map((d) => (d.name === 'name' ? { ...d, value } : d)));
    wrapper.unmount();
  });

  it('should show the default error message when there is some', () => {
    const message = 'Please choose a username';
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        errorMessage: 'some error message',
        validation: [
          {
            type: 'required',

            message,
          },
        ],
      },
    ] as FieldType[];
    const wrapper = app(fields);

    expect(wrapper.find(Input).props().errorMessage).toEqual(fields[0].errorMessage);

    wrapper.find('form').simulate('submit');

    expect(wrapper.find(Input).props().errorMessage).toEqual(message);
    wrapper.unmount();
  });

  xit('should set the error message after submission', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: 'a',
      },
    ] as FieldType[];

    const wrapper = app(fields);

    expect(wrapper.find(Input).props().value).toEqual('a');

    wrapper.find('input[name="name"]').simulate('change', { target: { value: 'b' } });
    expect(wrapper.find(Input).props().value).toEqual('b');

    wrapper.find('form').simulate('submit');

    const fieldsB = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        value: 'c',
      },
    ];
    wrapper.setProps({ fields: fieldsB });

    expect(wrapper.find(Input).props().value).toEqual('c');
    wrapper.unmount();
  });

  it('should not submit the form with invalid values', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: [
          {
            type: 'required',

            message: 'Please choose a username',
          },
        ],
      },
    ] as FieldType[];
    const onSubmit = jest.fn();

    const wrapper = app(fields, onSubmit);

    wrapper.find('form').simulate('submit');

    expect(wrapper.find(Input).props().errorMessage).toEqual('Please choose a username');
    wrapper.unmount();
  });

  it('should submit the form with all values valid', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: [
          {
            type: 'required',

            message: 'Please choose a username X',
          },
        ],
      },
    ] as FieldType[];
    const onSubmit = jest.fn();

    const wrapper = app(fields, onSubmit);

    wrapper.find('input[name="name"]').simulate('change', { target: { value: 'ok value' } });

    wrapper.find('form').simulate('submit');

    const expected = fields.map((field) => (field.name === 'name' ? { ...field, value: 'ok value' } : field));

    expect(onSubmit).toHaveBeenCalledWith(expected);
    wrapper.unmount();
  });

  it('should render and submit customComponents', () => {
    const fields = [
      {
        name: 'name',
        type: 'text',
        label: 'Name',
        validation: [],
      },
    ] as FieldType[];
    const onSubmit = jest.fn();

    const customComponents = (props: CustomComponentProps) =>
      props.type === 'text' ? (
        <input
          name="testNameInput"
          defaultValue={props.value as string}
          onChange={(e) => props.update({ name: props.name, value: e.target.value })}
        />
      ) : undefined;

    const wrapper = app(fields, onSubmit, customComponents);

    wrapper.find('input[name="testNameInput"]').simulate('change', { target: { value: 'ok value' } });

    wrapper.find('form').simulate('submit');

    expect(wrapper.find('input[name="testNameInput"]').props().defaultValue).toEqual('ok value');
    wrapper.unmount();
  });

  it('should render custom group component', () => {
    const groupFields = [
      {
        type: 'text',
        name: 'input',
        label: 'Input',
      },
    ] as FieldType[];
    const fields = [
      {
        name: 'name',
        type: 'group',
        label: 'Name',
        validation: [],
        fields: groupFields,
      },
    ] as FieldType[];
    const customComponents = (props: CustomComponentProps) =>
      props.type === 'group' ? (
        <div>
          <h2>My Custom Group</h2>
          {props.children}
        </div>
      ) : undefined;
    const onSubmit = jest.fn();

    const wrapper = app(fields, onSubmit, customComponents);

    expect(wrapper.find('h2').text()).toEqual('My Custom Group');

    expect(wrapper.find('input').prop('name')).toEqual('input');

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith(fields);
    wrapper.unmount();
  });
});
