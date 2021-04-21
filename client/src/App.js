import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import './App.css';
//redux 
import {Provider} from 'react-redux';
import store from './store'
import { loadUser } from './action/auth'
import setAuthToken from './util/setAuthToken'
import Routes from './components/routing/Routes'



if(localStorage.token){
  setAuthToken(localStorage.token)
}
const App = () => {
  useEffect(()=>{
    store.dispatch(loadUser())
  }, [])
  return (
    <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes} />
        </Switch>
       
      </Fragment>
    </Router>
  </Provider>
  )
}
 

export default App;
