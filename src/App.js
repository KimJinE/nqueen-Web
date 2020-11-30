import logo from './logo.svg';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import './App.css';

import MainPage from './MainPage/MainPage'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={MainPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
