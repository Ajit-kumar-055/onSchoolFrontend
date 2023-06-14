import './App.css';
import Home from './components/Pages/Home';
import Footer from './components/layouts/Footer';
import Navbar from './components/layouts/Navbar';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
function App() {
  return (
    <Router>
      <div className="App" >
        <Navbar></Navbar>
        <Home></Home>
        <Footer></Footer>
      </div>
    </Router>
  );
}

export default App;
