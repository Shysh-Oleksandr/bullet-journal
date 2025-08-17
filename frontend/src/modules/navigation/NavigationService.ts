import { useNavigate } from 'react-router-dom';

export const useAppNavigation = () => {
  const navigate = useNavigate();

  return {
    navigate: (route: string, options?: any) => {
      navigate(route, options);
    },
    goBack: () => {
      navigate(-1);
    },
  };
};
