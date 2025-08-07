import { Outlet } from 'react-router-dom';
import NavBar from '../components/navbar/navbar';


const MainLayout = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default MainLayout;