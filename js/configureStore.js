
import { AsyncStorage } from 'react-native';
import devTools from 'remote-redux-devtools';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import reducer from './reducers';
import promise from './promise';

export default function store(onCompletion:()=>void):any {
  const enhancer = compose(
    applyMiddleware(thunk, promise),
    autoRehydrate(),
    devTools({
      name: '0001_sais_edu_sg', realtime: true,
    }),
  );
   
  const store = createStore(reducer, enhancer);
  persistStore(store, { storage: AsyncStorage }, onCompletion);

  return store;
}
