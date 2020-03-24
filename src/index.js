import React, {Fragment} from 'react'
import ReactDOM from 'react-dom'
import {
  NavLink,
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import ApolloClient from 'apollo-boost'

import RunningDailyPage from './components/RunningDailyPage'
import RunningMonthlyPage from './components/RunningMonthlyPage'

import 'tachyons'
import './index.css'

const port = process.env.PORT || 4000;
fetch('/import');
const client = new ApolloClient({ uri: '/api' })

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Fragment>
        <nav className="pa3 pa4-ns">
          <Link
            className="link dim black b f6 f5-ns dib mr3"
            to="/"
            title="Home"
          >
            Home
          </Link>
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/running"
            title="Running"
          >
            Running monthly
          </NavLink>
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/running_day"
            title="Running cumulative"
          >
            Running cumulative
          </NavLink>
        </nav>
        <div className="fl w-100 pl4 pr4">
          <Switch>
            <Route exact path="/" component={RunningDailyPage} />
            <Route path="/running" component={RunningMonthlyPage} />
            <Route path="/running_day" component={RunningDailyPage} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  </ApolloProvider>,
  document.getElementById('root'),
)
