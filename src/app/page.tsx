import { auth } from '@/auth';
import { useSession } from 'next-auth/react';
import { FC } from 'react';

const Home: FC = async () => {
  const session = await auth();
  return(
    <div className=''>
    </div>
  );
};

export default Home;
