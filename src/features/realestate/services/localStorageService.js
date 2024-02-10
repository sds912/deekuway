const FILTER_PARAMS = "filter_params";
const ALLREADY_VIEW_POST = "allready_view_post";
const LAST_VIEWED_POST = "last_viewed_post";

export const saveFilterParams = (data) => {
  localStorage.setItem(FILTER_PARAMS, JSON.stringify(data));
}

export const loadFilterParams = () => {
    const params = localStorage.getItem(FILTER_PARAMS);
    return params !== null ? JSON.parse(params): {};
}

export const deleteFilterParams = () => {
  //const params = localStorage.removeItem(FILTER_PARAMS);
}

export const saveAlreadyViewPost = (id) => {
    const vp = sessionStorage.getItem(ALLREADY_VIEW_POST);
    const avpList = vp !== null ? JSON.parse(vp): [];

    if(!avpList.includes(id)){
      avpList.push(id);
      sessionStorage.setItem(ALLREADY_VIEW_POST, JSON.stringify(avpList));
    }
}

export const getAllReadyViewPost = () => {
  const vp = sessionStorage.getItem(ALLREADY_VIEW_POST);

  return  vp !== null ? JSON.parse(vp): [];
}

export const getLastSelectedPost = () => {
  const data = sessionStorage.getItem(LAST_VIEWED_POST);
  return data !== null ? data : null;

}

export const saveLastSelectedPost = (uid) => {
 sessionStorage.setItem(LAST_VIEWED_POST, uid);
}


