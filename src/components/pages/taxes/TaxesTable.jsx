import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";

import { FormField, taxesFields } from '../../../utils/form';
import DeleteForm from './DeleteForm';

const EditTaxesRow = ({ addToast, refreshData, setEditing, year }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = id => data => {
    fetch(`/api/taxes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    })
    .then(() => {
      refreshData();
      setEditing(false);
      addToast(`${data.year} updated`);
    });
  };

  return (
    <tr>
      <td colSpan={taxesFields.length + 1}>
        <form onSubmit={handleSubmit(onSubmit(year.year))}>
          <Row className="align-items-center">
            {
              taxesFields.map(field => {
                const f = {...field};
                f.defaultValue = field.value ? field.value(year[f.name]) : year[f.name];
                delete f.value;
                return <FormField
                    key={f.name}
                    errors={errors}
                    {...f}
                    register={register}
                  />
              })
            }
            <Col xs="auto">
              <Button type="submit">Update</Button>{' '}
              <Button onClick={() => setEditing(null)}>Cancel</Button>
            </Col>
          </Row>
        </form>
      </td>
    </tr>
  );
};

const TaxesRow = ({ addToast, editing, refreshData, setEditing, year }) => {
  if (editing) {
    return <EditTaxesRow
        addToast={addToast}
        refreshData={refreshData}
        setEditing={setEditing}
        year={year}
      />
  }
  return (
    <tr>
      {
          taxesFields.map(field => {
              let value = field.display ? field.display(year[field.name]) : year[field.name];
              return <td key={`${year.year}-${field.label}}`}>{value}</td>
          })
      }
      <td>
          <Button onClick={() => setEditing(year.year)}>Edit</Button>&nbsp;<DeleteForm id={year.year} refreshData={refreshData}  addToast={addToast} />
      </td>
    </tr>
  );
};


const TaxesTable = ({ addToast, editing, filter, lists, refreshData, setEditing, setFilter, setSearch, years}) => {

    return (
        <>
            <strong>Total Items:</strong> {years.length}
            <Table striped bordered hover>
            <thead>
                <tr>
                {
                    taxesFields.map(({label}) => <th key={`${label}`}>{label}</th>)
                }
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {
                years.map((year, i) => (
                    <TaxesRow
                      key={year.year}
                      addToast={addToast}
                      editing={editing === year.id}
                      lists={lists}
                      refreshData={refreshData}
                      setEditing={setEditing}
                      year={year} />
                ))
              }
            </tbody>
            </Table>
        </>
    )
}

export default TaxesTable;
