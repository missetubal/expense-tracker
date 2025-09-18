import { useContext, type PropsWithChildren } from 'react';
import { UserContext } from '../../context/user-context';
import { Navbar } from '../Navbar';
import { SideMenu } from '../SideMenu';

export const DashboardLayout = ({ children }: PropsWithChildren) => {
  const { user } = useContext(UserContext);
  return (
    <div>
      <Navbar activeMenu={activeMenu} />
      {user && (
        <div className='flex'>
          <div className='max-[1080px]:hidden'>
            <SideMenu activeMenu={activeMenu} />
          </div>
          <div className='grow mx-5'>{children}</div>
        </div>
      )}
    </div>
  );
};
