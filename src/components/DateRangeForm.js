import { Button, Col, Form, Row } from 'react-bootstrap';
import { useForm } from "react-hook-form";
import { useSearchParams } from 'react-router-dom';

import { FormField } from '../utils/form';

const DateRangeForm = () => {
  const [ searchParams, setSearchParams] = useSearchParams();
  const onSubmit = async (data) => {

    console.log('submitting', data);
    setSearchParams({
      ...data
    });
    // navigate(`./?startDate=${data.startDate}&endDate=${data.endDate}`, { replace: true });
  };
  const { register, handleSubmit, formState: { errors } } = useForm();
  return (<Form onSubmit={handleSubmit(onSubmit)}>
    <Row className="align-items-center">
      <FormField errors={errors} label="Start Date" name="startDate" defaultValue={searchParams.get('startDate')} register={register} type="date"  />
      <FormField errors={errors} label="End Date" name="endDate" defaultValue={searchParams.get('endDate')} register={register} type="date"  />
      <Col xs="auto">
        <Button type="submit" className="mb-1">
          Update
        </Button>
      </Col>
    </Row>
  </Form>);
};

export default DateRangeForm;
