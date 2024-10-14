import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Login from "./components/Login";
import Protected from "./components/Protected";
import Admin from "./components/Admin";
import Logout from "./components/Logout";
import Register from "./components/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define a route for the base path ("/") */}
        <Route path="/" element={<Navigate to="/login" />} />{" "}
        {/* Redirect to login or any other page */}
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
