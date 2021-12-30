import React from "react";
import { Pagination } from 'react-bootstrap';

const PrimaryPagination = ({ numPages, active }) => {
  const pages = new Array(numPages).fill(1);
  console.log(pages);
  return (
    <Pagination>
      {
        pages.map((_, i) => (
          <Pagination.Item key={i + 1} active={i === active}>
          {i + 1}
        </Pagination.Item>
        ))
      }
    </Pagination>
  );
};

export default PrimaryPagination;
