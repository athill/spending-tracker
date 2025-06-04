import React from 'react';
import Chart from "react-google-charts";

export const defaultCategoryMap = {
  luxuries: ['alcohol', 'entertainment', 'gift', 'restaurant', 'smokes', 'travel'],
  charity: ['charity', 'donation'],
  necessities: ['clothing', 'grocery', 'health', 'home', 'insurance', 'postage'],
  tax: ['tax'],
  transportation: ['transportation'],
  work: ['office', 'web'],
  utilities: ['utilities'],
};

const CategorySummaryChart = ({ categories, categoryMap = defaultCategoryMap }) => {
  const data = [['Category', 'Total']];
  const uncategorized = {};
  const categorizedCategories = {};
  categories.forEach(({ category, total }) => {
    let categorized = false;
    for (const key in categoryMap) {
      if (categoryMap[key].includes(category)) {
        categorized = true;
        if (!categorizedCategories[key]) {
          categorizedCategories[key] = 0;
        }
        categorizedCategories[key] += parseFloat(total);
      }
    }
    if (!categorized) {
      uncategorized[category] = null;
      const key = 'other';
      if (!categorizedCategories[key]) {
        categorizedCategories[key] = 0;
      }
      categorizedCategories[key] += parseFloat(total);
    }
  });
  Object.keys(categorizedCategories).forEach(key => {
    data.push([key, categorizedCategories[key]]);
  });

  console.log('uncategorized categories', Object.keys(uncategorized));

  return  (
    <Chart
      width={'650px'}
      height={'450px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
          title: 'Spending by Categorized Category',
      }}
      rootProps={{ 'data-testid': '1' }}
    />
  );
};

export default CategorySummaryChart;
