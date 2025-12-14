import { useAuth } from "./AuthContext";
import Admin from "./component/Admin/RoleLayout";
import Manager from "./component/manager/RoleLayout";
import Staff from "./component/Staff/RoleLayout";

const RoleLayout = ({ children }) => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role === "Admin") return <Admin>{children}</Admin>;
  if (user.role === "Manager") return <Manager>{children}</Manager>;
  if (user.role === "Staff") return <Staff>{children}</Staff>;

  return null;
};

export default RoleLayout;
