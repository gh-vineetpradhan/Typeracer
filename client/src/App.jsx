import { Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Header from "./components/header";
import Practice from "./pages/practice";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/practice" element={<Practice />} />
      </Routes>
    </>
  );
}
