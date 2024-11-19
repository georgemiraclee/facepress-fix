import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.FC) => {
  const AuthComponent: React.FC = (props) => {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("token");

      if (!token) {
        // Redirect to login if no token is found
        router.push("/admin");
      }
    }, []);

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
