const FILTER_PARAMS = "filter_params";

export const saveFilterParams = (data) => {
  localStorage.setItem(FILTER_PARAMS, JSON.stringify(data));
}

export const loadFilterParams = () => {
    const params = localStorage.getItem(FILTER_PARAMS);
    return params !== null ? JSON.parse(params): null;
}

export const deleteFilterParams = () => {
  const params = localStorage.removeItem(FILTER_PARAMS);
}


