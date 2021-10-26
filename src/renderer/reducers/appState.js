import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LOCATION_CHANGE } from 'connected-react-router';

const fetchDataByDS = createAsyncThunk(
  'ksg/fetchDataByDS',
  async (obj) => {
    const { value, pathname } = obj;
    const result = await axios(`${pathname}_search?ds=${value}`)
      .then(({ data }) => data)
      .catch(() => console.log('fail'));
    return result;
  },
);

const fetchDataByUsl = createAsyncThunk(
  'ksg/fetchDataByUsl',
  async (obj) => {
    console.log(obj);
    const { value, pathname } = obj;
    const result = await axios(`${pathname}_search?usl=${value}`)
      .then(({ data }) => data)
      .catch(() => console.log('fail'));
    return result;
  },
);

const storeSlice = createSlice({
  name: 'ksg',
  initialState: {
    list: [], url: '', diagnos: { type: 'input', value: '' }, usl: { type: 'input', value: '' }, status: 'empty',
  },
  reducers: {
    addDsValue(state, { payload }) {
      state.diagnos.value = payload;
      return state;
    },
    addUslValue(state, { payload }) {
      state.usl.value = payload;
      return state;
    },
    addUrl(state, { payload }) {
      state.url = payload;
      return state;
    },
    changeType(state, { payload }) {
      const { id, type } = payload;
      state[id].type = type;
      return state;
    },
    changeStatus(state, { payload }) {
      state.status = payload;
      return state;
    },
  },
  extraReducers: {
    [fetchDataByDS.fulfilled](state, { payload }) {
      state.list = payload;
      return state;
    },
    [fetchDataByUsl.fulfilled](state, { payload }) {
      state.list = payload;
      return state;
    },
    [LOCATION_CHANGE](state) {
      state.list = [];
      state.diagnos.value = '';
      state.usl.value = '';
      state.status = 'empty';
      state.diagnos.type = 'input';
      state.usl.type = 'input';
    },
  },
});

const getFilters = ({ appState }) => ({ diagnos: appState.diagnos.value, usl: appState.usl.value });
const getList = ({ appState }) => appState.list;

export const FilterSelector = createSelector([getList, getFilters],
  (list = [], filters) => {
    const { diagnos, usl } = filters;
    const regex1 = new RegExp(`^${diagnos}`, 'i');
    const regex2 = new RegExp(`^${usl}`, 'i');
    return list.filter((item) => regex1.test(item.MKB_1) && regex2.test(item.COD_USL));
  });

export const {
  addDsValue, addUslValue, changeStatus, changeType, addUrl,
} = storeSlice.actions;
export { fetchDataByDS, fetchDataByUsl };

export default storeSlice.reducer;
