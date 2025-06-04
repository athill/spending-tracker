import React from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { camelCase } from 'change-case';

import { FormField, taxesFields } from '../../../utils/form';
import { patch } from '../../../utils/fetch';
import DeleteForm from './DeleteForm';

const EditTaxesRow = ({ addToast, refreshData, setEditing, year }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = id => async data => {
    await patch(`/api/taxes/${id}`, data);
    refreshData();
    setEditing(false);
    addToast(`${data.year} updated`);
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
              const fieldName = camelCase(field.name);

              let value = field.display ? field.display(year[fieldName]) : year[fieldName];
              return <td key={`${year.year}-${field.label}}`}>{value}</td>
          })
      }
      <td>
          <Button onClick={() => setEditing(year.year)}>Edit</Button>&nbsp;<DeleteForm year={year.year} refreshData={refreshData}  addToast={addToast} />
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
                      editing={editing === year.year}
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
