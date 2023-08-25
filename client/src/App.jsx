import { Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Header from "./components/header";

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}
