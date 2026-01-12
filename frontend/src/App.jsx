import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import VotingPage from "./components/VotingPage";
import AdminPanel from "./components/AdminPanel";


function App() {
  const [page, setPage] = useState("login");

  return (
    <div>
      {page === "login" && <Login setPage={setPage} />}

      {page === "register" && <Register setPage={setPage} />}

      {page === "vote" && <VotingPage setPage={setPage} />}

      {page === "admin" && <AdminPanel />}
    </div>
  );
}

export default App;
