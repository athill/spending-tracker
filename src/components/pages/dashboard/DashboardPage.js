import React, { useCallback, useEffect, useState } from 'react';
import { Col, Container, Row} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import CategoryChart from "./CategoryChart";
import MonthlyChart from "./MonthlyChart";
import { get } from '../../../utils/fetch';
import DateRangeForm from '../../DateRangeForm';
import CategorySummaryChart from './CategorySummaryChart';
import UtilitiesChart from './UtilitiesChart';

const DashboardPage = () => {
  const [ searchParams ] = useSearchParams();
  const [data, setData] = useState({
    categories: [],
    monthly: {
      data: [],
      categories: []
    },
    utilities: {
      data: [],
      stores: []
    }
  });
  const getData = useCallback(async () => {
    let url = '/api/dashboard';
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    const data = await get(url);

    setData(data);
  }, [searchParams])

  useEffect(() => {
    getData();
  }, [getData]);
  return (
  <>
    <DateRangeForm />
    <Container>
      <Row>
        <Col sm={6}><CategoryChart categories={data.categories} /></Col>
        <Col sm={6}><CategorySummaryChart categories={data.categories} /></Col>
      </Row>
      <Row>
        <Col><MonthlyChart monthly={data.monthly} /></Col>
      </Row>
      <Row>
        <Col><UtilitiesChart utilities={data.utilities} /></Col>
      </Row>      
    </Container>
  </>
)};

export default DashboardPage;
