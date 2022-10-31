import axios from "axios";
import {BASE_URL } from "../globals/config";

const client = () => {
  return axios.create({
      baseURL:BASE_URL,
  });
};

const Api = {
  Sales: {
    getAll: (page = 1, search = "", sortBy = "", sort = "", perPage = 10) => {
      return client().get(`/sales?page=${page}&perPage=${perPage}&search=${search}&sortBy=${sortBy}&sort=${sort}`);
    },
    post: (data = {}) => {
      return client().post(`/sales`, data);
    },
  },

  Barang: {
    getAll: async () => {
      return client().get(`/barang`);
    },
  },

  Customer: {
    getAll: async () => {
      return client().get(`/customer`);
    },
  },
};

export default Api;
