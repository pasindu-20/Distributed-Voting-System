import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import VotingPage from "./components/VotingPage";
import AdminPanel from "./components/AdminPanel";

function App(): JSX.Element {
  const [page, setPage] = useState<string>("login");

  return (
    <div className="container flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {page === "login" && <Login setPage={setPage} />}

        {page === "register" && <Register setPage={setPage} />}

        {page === "vote" && <VotingPage setPage={setPage} />}

        {page === "admin" && <AdminPanel setPage={setPage} />}
      </div>
    </div>
  );
}

export default App;
