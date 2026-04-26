import { Col, Form } from 'react-bootstrap';
import { capitalCase } from 'change-case';
import { currencyFormat } from '.';

const Options = ({ lists, list }) => (
  <>
        {
          lists[list].map(option => {
            const value = option.value || option;
            const label = option.label || option;
            return <option key={value} value={value}>{label}</option>
          })
        }
  </>
);

const FormControl = ({label, list, lists, name, register, registerProps, required, ...atts}) => (
  <>
    <Form.Control className="mb-2" placeholder={label} list={list} {...register(name, {...registerProps, required })} {...atts} />
    {lists && lists[list] && (
      <datalist id={list}>
        <Options lists={lists} list={list} />
      </datalist>
    )}
  </>
);

const SelectControl = ({label, list, lists, name, register, registerProps, required, ...atts}) => (
  <>
    <Form.Select className="mb-2" placeholder={label} {...register(name, {...registerProps, required })} {...atts}>
    {lists && lists[list] && <Options lists={lists} list={list} /> }
    </Form.Select>
  </>
);

export const FormField = ({ display, errorMessage, errors, label, list, lists, name, register, registerProps = {}, required, ...atts }) => {
  const isSelect = atts.type && atts.type === 'select';
  const Component = isSelect ? SelectControl : FormControl;
  return (
      <Col xs="auto">
        <Form.Group className="mb-2">
          <Form.Label htmlFor={name} visuallyHidden={!isSelect}>{label}: </Form.Label>
          <Component label={label} list={list} lists={lists} name={name} register={register} registerProps={registerProps} required={required} {...atts} />
          {errors[name] && <span>This field is required</span>}
          {errors[name] && errorMessage && <div>{errorMessage}</div>}
        </Form.Group>
      </Col>
    );
  }

  // const headers = ['Date', 'Store', 'Quantity', 'Item', 'Price', 'Category'];
const dateDisplay = value => (value ? new Date(value) : new Date()).toISOString().substring(0, 10);
export const transactionFields = [
  { name: 'date', type: 'date', value: dateDisplay, display: value => new Date(value.substring(0, 10)).toLocaleDateString(), required: true },
  { name: 'store', required: true , list: "stores"},
  { name: 'quantity', registerProps: { pattern: /\d+|\d+ \w+|\d+ * \d+ \w+/ }, errorMessage: "This field must be a number, and number and a unit, or a multtiplier times a number and  unit"},
  { name: 'item', list: 'items', required: true },
  { name: 'price', required: true, display: value => currencyFormat(value) },
  { name: 'category', list: 'categories', required: true },
].map(field => ({
  ...field,
  label: field.name.charAt(0).toUpperCase() + field.name.slice(1)
}));

export const taxesFields = [
  { name: 'year',  required: true },
  { name: 'wages', required: true, display: value => currencyFormat(value) },
  { name: 'ss_wages', label: "SS Wages", required: true, display: value => currencyFormat(value) },
  { name: 'fed_withheld', required: true, display: value => currencyFormat(value) },
  { name: 'ss_withheld', label: 'SS Withheld', required: true, display: value => currencyFormat(value) },
  { name: 'medicare_withheld', required: true, display: value => currencyFormat(value) },
  { name: 'state_tax', required: true, display: value => currencyFormat(value) },
  { name: 'local_tax', required: true, display: value => currencyFormat(value) }
].map(field => ({
  ...field,
  registerProps: field.name === 'year' ? null : { pattern: /\d+(\.\d+)?/ },
  label: field.label ? field.label : capitalCase(field.name.replace('_', ' '))
}));

const getField = (fieldDefs, name) => {
  const matches = fieldDefs.filter(field => field.name === name);
  if (matches.length === 0 ) {
    throw new Error(`Invalid name, ${name}`);
  }
  return matches[0];
};

export const getTransactionField = name => {
  return getField(transactionFields, name);
};

export const getTaxesField = name => {
  return getField(taxesFields, name);
};

export const annualCategoryFields = [
  { name: 'category', required: true },
  { name: 'month', type: "select", list: 'months', required: true },
  { name: 'recurrence', required: true, defaultValue: 1, type: 'number', min: '1'  }
].map(field => ({
  ...field,
  label: field.label ? field.label : capitalCase(field.name.replace('_', ' '))
}));

export const annualFields = [
  { name: 'year', required: true, defaultValue: new Date().getFullYear(), type: 'select', list: 'years', registerProps: { pattern: /\d{4}/, errorMessage: 'Please enter a 4 digit year'} },
  { name: 'category_id', type: 'select', label: 'Category', required: true , list: "categories"},
  { name: 'amount', required: true, display: value => currencyFormat(value) },
].map(field => ({
  ...field,
  label: field.label ? field.label : capitalCase(field.name.replace('_', ' '))
}));




