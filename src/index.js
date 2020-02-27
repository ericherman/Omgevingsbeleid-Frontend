import React from 'react'
import ReactDOM from 'react-dom'
import App from './App/index'
import ScrollToTop from './components/ScrollToTop'
import * as serviceWorker from './serviceWorker'

import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        <ScrollToTop />
        <App />
    </BrowserRouter>,
    document.getElementById('root')
)

serviceWorker.unregister()
