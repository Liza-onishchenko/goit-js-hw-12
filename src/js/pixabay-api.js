import axios from 'axios';

const BASE_URL ='https://pixabay.com/api/';
const API_KEY = '45541862-830ec78a7fc3c846a462bfeb1';

export const fetchPhotos = async (searchedQuery, page) => { 
    const axiosOptions = {
     params:{
       key: API_KEY,
       q: searchedQuery,
       image_type: 'photo',
       orientation: 'horizontal',
       safesearch: 'true',
       page: page,
       per_page: 15,
    },
  };
    return axios.get(`${BASE_URL}`, axiosOptions);
 };