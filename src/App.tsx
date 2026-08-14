import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AppRouter } from "./app/router";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./lib/auth";
import "./i18n";
import "./styles/global.css";

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
