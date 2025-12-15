import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Nav from "./component/Admin/Nav";
import Header from "./component/Admin/Header";

export default function RoleLayout({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <div>Loading...</div>;

  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      <Nav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}
