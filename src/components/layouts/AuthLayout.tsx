import { type PropsWithChildren } from 'react';
import CARD_2 from '../../assets/images/card2.png';
import { StatsInfoCard } from '../StatsInfoCard';
import { LuTrendingUpDown } from 'react-icons/lu';
export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex'>
      <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
        <h2 className='text-lg font-medium text-black'>Expense Tracker</h2>
        {children}
      </div>

      <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center overflow-hidden p-8 relative'>
        <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5' />
        <div className='w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10' />
        <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5' />
        <div className='grid grid-cols-1 z-20'>
          <StatsInfoCard
            color='bg-primary'
            icon={<LuTrendingUpDown />}
            label='Track your Income'
            value='430,00'
          />
        </div>
        <img
          src={CARD_2}
          className='w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/15'
        />
      </div>
    </div>
  );
};
