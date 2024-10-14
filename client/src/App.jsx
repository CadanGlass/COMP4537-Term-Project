import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";

import Login from "./components/Login";
import Protected from "./components/Protected";
import Admin from "./components/Admin";
import Logout from "./components/Logout";
import Register from "./components/Register";

function Home() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <Link to="/protected">Protected</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Define a route for the base path ("/") */}
        <Route path="/" element={<Home />} /> {/* Main page with links */}
        {/* Your other routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/protected" element={<Protected />} />
        <Route path="/logout" element={<Logout />} />
        {/* Fallback route for undefined paths */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
