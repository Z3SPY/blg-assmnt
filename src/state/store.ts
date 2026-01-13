import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './session/session';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['session'] // Only persist the session slice
};

const persistedReducer = persistReducer(persistConfig, sessionReducer);


export const store = configureStore({
  reducer: {
    session: persistedReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;