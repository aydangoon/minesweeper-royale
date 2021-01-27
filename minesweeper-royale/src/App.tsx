import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Home from './home';
import Lobby from './lobby';

class App extends React.Component<any, any> {

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/lobby" component={Lobby} />
          <Route path="/" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default App;
