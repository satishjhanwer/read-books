import axios from 'axios';

export const requestBookSearch = async (searchTerm) => {
  return await axios.get(`/api/search?q=${encodeURI(searchTerm)}`);
};
