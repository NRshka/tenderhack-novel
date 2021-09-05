import React from 'react';
import { Route, IndexRoute } from 'react-router';

/**
 * Import all page components here
 */
import App from './App'
import ProductCard from '.components/home' 

/**
 * All routes go here.
 * Don't forget to import the components above after adding new route.
 */
export default (
  <Route path="/" component={App}>\
    <Route path="/some/where" component={SomePage} />
  </Route>
);