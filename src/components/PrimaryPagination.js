import React from "react";
import { Pagination } from 'react-bootstrap';

const PrimaryPagination = ({ delta = 2, numPages, active, setActive }) => {
  const pages = Array.from(Array(numPages).keys());
  const length = pages.length;
  const start = active - delta < 0 ? 
      0 
      : Math.min(active - delta, length - (delta *  2 + 1));
  const end = active + delta > length - 1 
      ? length - 1
      : Math.max(delta * 2, active + delta);
  const show = pages.slice(start, end + 1);
  const previousDisabled = active === 0;
  const nextDisabled = active === length - 1;
  return (
    <Pagination>
        <Pagination.First disabled={previousDisabled} onClick={() => setActive(0)} /> 
        <Pagination.Prev disabled={previousDisabled} onClick={() => setActive(active - 1)} />
      { active > delta && <Pagination.Ellipsis disabled /> }
      {
        show.map((i) => (
          <Pagination.Item key={i} active={i === active} onClick={() => setActive(i)}>
            { i + 1 }
          </Pagination.Item>
        ))
      }
      { active < length - delta - 1 &&  <Pagination.Ellipsis disabled /> }
        <Pagination.Next disabled={nextDisabled} onClick={() => setActive(active + 1)} />
        <Pagination.Last disabled={nextDisabled} onClick={() => setActive(pages.length - 1)} />
    </Pagination>
  );
};

export default PrimaryPagination;

