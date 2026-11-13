import { useLocation, Link, Navigate } from "react-router-dom";
import { resolveLegacyRedirect } from "@/lib/legacyRedirects";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const legacyTarget = resolveLegacyRedirect(location.pathname);

  useEffect(() => {
    if (legacyTarget) return;
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname, legacyTarget]);

  if (legacyTarget) {
    return <Navigate to={legacyTarget} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-4">Ops! Página não encontrada</p>
        <Link to="/" className="text-primary hover:text-primary/80 underline">
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
