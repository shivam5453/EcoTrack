import { useAuthContext } from '../context/AuthContext';

/**
 * Hook to quickly fetch session variables, user settings,
 * register/login handlers, and active toast configurations.
 */
export const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
