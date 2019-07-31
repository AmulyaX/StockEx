import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import themes, { overrides } from '../themes';
import Layout from './Layout';

const theme = createMuiTheme({...themes.default, ...overrides});

const PrivateRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest} render={props => ((
        React.createElement(component, props)
      ))}
    />
  );
};

const App = () => (
  <MuiThemeProvider theme={theme}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/app/dashboard" />} />
        <Route exact path="/app" render={() => <Redirect to="/app/dashboard" />} />
        <PrivateRoute path="/app" component={Layout} />
      </Switch>
    </BrowserRouter>
  </MuiThemeProvider>
);

export default App;