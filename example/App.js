import React from 'react'
import { Router, Route } from 'react-router-dom'
import ClassComp from './components/classComp'
import FunctionComp from './components/functionComp'
import history from './history'

function App () {
  return (
    <Router history={history}>
      <Route exact path='/'>
        <div>
          <h3>ES6 Class Component</h3>
          <ClassComp />
        </div>
        <div>
          <h3>Functional Component</h3>
          <FunctionComp />
        </div>
      </Route>
    </Router>
  )
}

export default App
