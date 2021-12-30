import React from "react";
import { Pagination } from 'react-bootstrap';

const PrimaryPagination = ({ numPages, active, setActive }) => {
  const pages = new Array(numPages).fill(1);
  return (
    <Pagination>
      {
        pages.map((_, i) => (
          <Pagination.Item key={i} active={i === active} onClick={() => setActive(i)}>
          {i + 1}
        </Pagination.Item>
        ))
      }
    </Pagination>
  );
};

export default PrimaryPagination;
