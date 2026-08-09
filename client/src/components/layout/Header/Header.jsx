import { Search, Bell, ShoppingCart, CircleUser } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import Greetings from '../../common/Greetings';
import useCartStore from '../../../store/useCartStore';
import NotificationButton from './NotificationButton';

export default function Header({ showSearchBar = true, showGreeting = true }) {
    const navigate = useNavigate();
    const items = useCartStore((s) => s.items);
    const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <header className='flex flex-col gap-6 bg-[#0D1117] px-8 py-6'>

            {/* Navbar Row — always visible (search bar is optional, notif+cart always show) */}
            <div className={`flex items-center ${showSearchBar ? 'justify-between' : 'justify-end'}`}>

                {showSearchBar && <SearchBar />}

                {/* Notification + Cart group — always present */}
                <div className='flex items-center gap-3'>

                    {/* Notifications */}
                    <div className='relative'>
                        
                        <NotificationButton />
                        
                        <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[11px] font-bold text-black'>
                            2
                        </span>
                    </div>

                    {/* Cart — navigates to /cart */}
                    <div className='relative'>
                        <button
                            onClick={() => navigate('/cart')}
                            className="rounded-xl bg-[#161B22] p-3 text-zinc-400 transition-all duration-300 hover:bg-[#1F2937] hover:text-cyan-400 cursor-pointer"
                        >
                            <ShoppingCart size={20} />
                        </button>
                        {cartCount > 0 && (
                            <span className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400 text-[11px] font-bold text-black animate-bounce'>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                    </div>

                    {/* <button className="rounded-xl bg-[#161B22] p-3 mr-3 text-zinc-400 transition-all hover:bg-[#1F2937] hover:text-cyan-400 cursor-pointer">
                        <CircleUser size={20} />
                    </button> */}

                </div>
            </div>

            {/* Greetings — only shown when showGreeting is true */}
            {showGreeting && <Greetings user="Krish" />}

        </header>
    );
}