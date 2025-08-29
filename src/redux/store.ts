import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import businessReducer from './slices/businessSlice';
import vapiReducer from './slices/vapiSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['business', 'vapi'],
};

const persistedBusinessReducer = persistReducer(persistConfig, businessReducer);
const persistedVapiReducer = persistReducer(persistConfig, vapiReducer);

export const store = configureStore({
  reducer: {
    business: persistedBusinessReducer,
    vapi: persistedVapiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 