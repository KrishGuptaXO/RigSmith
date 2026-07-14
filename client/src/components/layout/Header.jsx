import { Search, Bell, ShoppingCart, CircleUser } from 'lucide-react';
import Button from '../ui/common/Button';

export default function Header(){
    return (
        <header className='flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#0D1117]'>
            { /* Left */}
            <div>
                <h1 className='text-2xl font-bold text-white'>
                    Good Morning, Krish 👋🏼
                </h1>
                
                <p className='text-sm text-zinc-400'>
                    Welcome to RigSmith
                </p>
            </div>
            
            {/* Right */}
            <div className='flex items-center gap-4'>

                <Button>
                    <Search size={20} />
                </Button>

                <Button>
                    <Bell size={20} />
                </Button>

                <Button>
                    <ShoppingCart size={20} />
                </Button>

                <Button>
                    <CircleUser size={20} />
                </Button>
            </div>
        </header>
    );
}