import React from 'react';
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import RootRoute from './router/router';

import { createStore } from 'redux'
import appStore from './reducers'
import { Provider } from 'react-redux'

import { ApolloProvider } from 'react-apollo'
import {client} from './api/graphql/index';

let store = createStore(appStore)

function App() {
	return (
		<ApolloProvider client={client}>
			<Provider store={store}>
				<BrowserRouter >
					<RootRoute></RootRoute>
				</BrowserRouter>
			</Provider>
		</ApolloProvider>
	);
}

export default App;
