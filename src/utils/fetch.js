

export const get = async (path) => {
    const response = await fetch(path);
    const json = await response.json();
    return json;
};

export const post = async (path, data) => {
    const response = await fetch(path, {
      method: "POST",
      body: data,
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    const json = await response.json();
    return json;
};
