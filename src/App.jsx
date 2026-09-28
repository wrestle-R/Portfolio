import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Resume from "./pages/Resume";
import NotFound from "./pages/NotFound";
import SceneBoundary from "../minecraft/components/SceneBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { registerCopyAttribution } from "./lib/copyAttribution";

const MinecraftPage = React.lazy(
  () => import("../minecraft/MinecraftPage.jsx"),
);

function App() {
  React.useEffect(() => {
    return registerCopyAttribution();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/resume" element={<Resume />} />
            <Route
              path="/minecraft"
              element={
                <SceneBoundary
                  fallback={
                    <div role="alert" style={{ padding: 40 }}>
                      The house couldn’t load.{" "}
                      <a href="/minecraft">Try again</a> or{" "}
                      <a href="/">read the main portfolio</a>.
                    </div>
                  }
                >
                  <React.Suspense
                    fallback={
                      <div role="status" style={{ padding: 40 }}>
                        Opening the house…
                      </div>
                    }
                  >
                    <MinecraftPage />
                  </React.Suspense>
                </SceneBoundary>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
