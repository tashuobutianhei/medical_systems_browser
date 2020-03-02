import React from 'react';
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import RootRoute from './router/router';

import { createStore } from 'redux'
import appStore from './reducers'
import { Provider } from 'react-redux'


let store = createStore(appStore)


function App() {
	return (
		<Provider store={store}>
			<BrowserRouter >
				<RootRoute></RootRoute>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
