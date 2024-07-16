import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivateRoute from "./utils/PrivateRoute";
import Layout from "./utils/layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import signup from "./pages/signup";
import { AuthProvider } from "./context/AuthContext";
import VideoPlayer from "./components/videoplayer";
import SearchResults from "./pages/searchresults";
import LivePlayer from "./components/Liveplayer";
function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoute />}>
              <Route Component={Layout} path="/">
                <Route Component={HomePage} path="" />
                <Route path="video/:filename" element={<VideoPlayer />} />
                <Route path="live/:filename" element={<LivePlayer />} />
                <Route path="search/:searchquery" element={<SearchResults />} />
              </Route>
            </Route>
            <Route Component={LoginPage} path="/login" />
            <Route Component={signup} path="/signup" />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
