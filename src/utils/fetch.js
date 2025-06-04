import axios from "axios";







export const client = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
  },
});

// export const get = async (path) => {
//   return ;
// };

const send = (method) => async (path, data) => {
  return await client.request({
    url: path,
    method: method,
    data,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
    }
  });
};

export const get = send('GET');


export const post = send('POST');

export const patch = send('PATCH');

export const put = send('PUT');

export const del = send('DELETE');
