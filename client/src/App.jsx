import { Routes, Route } from "react-router-dom";
import Navbar     from "./components/Navbar";
import Home       from "./pages/Home";
import Calculator from "./pages/Calculator";
import FindCar    from "./pages/FindCar";
import Gallery    from "./pages/Gallery";

function App() {
  return (
    <div className="bg-[#080C14] min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />}       />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/find-car"   element={<FindCar />}    />
        <Route path="/gallery"    element={<Gallery />}    />
      </Routes>
    </div>
  );
}

export default App;