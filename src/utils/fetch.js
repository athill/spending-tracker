

export const get = async (path) => {
    const response = await fetch(path);
    const json = await response.json();
    return json;
};

const send = (method) => async (path, data) => {
  const response = await fetch(path, {
    method: method,
    body: data,
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  });
};

export const post = send('POST');

export const patch = send('PATCH');
