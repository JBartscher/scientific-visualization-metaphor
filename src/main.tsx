import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Characters from "./Characters";
import "./index.css";
import Newsletter from "./Newsletter";
import ViewBox from "./ViewBox";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Newsletter />} />
    <Route path="/characters" element={<Characters />} />
    <Route path="/v" element={<ViewBox />} />
  </Routes>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
