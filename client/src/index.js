import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from './AppContainer'
import store from "./redux/store"
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.render(
	<BrowserRouter>
		<Provider store={store}>
			<AppContainer />
		</Provider>
	</BrowserRouter>,
  document.getElementById('root')
);

