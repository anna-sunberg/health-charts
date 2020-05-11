import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { NavLink, Link, BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import HomePage from './components/HomePage';
import WorkoutDailyPage from './components/WorkoutDailyPage';
import WorkoutMonthlyPage from './components/WorkoutMonthlyPage';

import 'tachyons';
import './index.css';

process.env.NODE_ENV !== 'development' && fetch('/import');

const client = new ApolloClient({ uri: '/api' });

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router>
      <Fragment>
        <nav className="pa3 pa4-ns">
          <Link className="link dim black b f6 f5-ns dib mr3" to="/" title="Home">
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
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/cycling"
            title="Cycling"
          >
            Cycling
          </NavLink>
          <NavLink
            className="link dim f6 f5-ns dib mr3 black"
            activeClassName="gray"
            exact={true}
            to="/cycling_day"
            title="Cycling cumulative"
          >
            Cycling cumulative
          </NavLink>
        </nav>
        <div className="fl w-100">
          <Switch>
            <Route exact path="/" component={() => <HomePage />} />
            <Route path="/running" component={() => <WorkoutMonthlyPage type="running" />} />
            <Route path="/cycling" component={() => <WorkoutMonthlyPage type="cycling" />} />
            <Route path="/running_day" component={() => <WorkoutDailyPage type="running" />} />
            <Route path="/cycling_day" component={() => <WorkoutDailyPage type="cycling" />} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  </ApolloProvider>,
  document.getElementById('root')
);
