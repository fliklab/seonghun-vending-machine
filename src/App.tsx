import { NavLink, Outlet, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SimulatorPage from "./pages/simulator/SimulatorPage";
import ArchitecturePage from "./pages/architecture/ArchitecturePage";
import NotFoundPage from "./pages/not-found/NotFoundPage";

const navItems = [
  { label: "홈", to: "/" },
  { label: "시뮬레이터", to: "/simulator" },
  { label: "시스템 아키텍처", to: "/architecture" },
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-[0.3em] text-slate-400">
            <span role="img" aria-label="vending machine" className="mr-2">
              🥤
            </span>
            Vending Machine
          </span>
          <div className="flex items-center gap-3 text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "rounded-full px-4 py-2 font-semibold transition",
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
      <Outlet />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="architecture" element={<ArchitecturePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
