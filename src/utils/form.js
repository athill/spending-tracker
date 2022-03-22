import { Col, Form } from 'react-bootstrap';
import { currencyFormat } from '.';

export const FormField = ({ display, errorMessage, errors, label, list, lists, name, register, registerProps = {}, required, ...atts }) => {
  return (
      <Col xs="auto">
        <Form.Group className="mb-2">
          <Form.Label htmlFor={name} visuallyHidden>{label}: </Form.Label>
          <Form.Control className="mb-2" placeholder={label} list={list} {...register(name, {...registerProps, required })} {...atts} />
            {lists && lists[list] && (
              <datalist id={list}>
                {
                  lists[list].map(option => <option key={option}>{option}</option>)
                }
              </datalist>
            )}
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

export const getTransactionField = name => {
  const matches = transactionFields.filter(field => field.name === name);
  if (matches.length === 0 ) {
    throw new Error(`Invalid name, ${name}`);
  }
  return matches[0];
}




