import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { langs, type Lang } from "../config/site";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function Layout() {
  const { lang } = useParams();
  const location = useLocation();

  if (!langs.includes(lang as Lang)) {
    const rest = location.pathname.replace(/^\/[^/]+/, "") || "";
    return <Navigate to={`/en${rest}${location.search}${location.hash}`} replace />;
  }

  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
