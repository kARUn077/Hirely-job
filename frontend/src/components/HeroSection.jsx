import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center'>
            <div className='flex flex-col gap-5 mb-[-28px]'>
                <span className=' mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. 1 Job Hunt Website</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#8B5C2A]'>Dream Jobs</span></h1>
                <p>Discover thousands of jobs tailored for you. Start your journey to a brighter career today!</p>
                <div className="flex w-full max-w-xl mx-auto items-center gap-0 bg-[#f8f4ee] border border-[#e5d3c2] rounded-full shadow-inner focus-within:ring-2 focus-within:ring-[#8B5C2A] transition-all">
                    <input
                        type="text"
                        placeholder="Find your dream jobs"
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 px-6 py-3 bg-transparent text-gray-800 placeholder-gray-400 rounded-l-full outline-none border-none focus:bg-white transition-all"
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#8B5C2A] hover:bg-[#704214] px-6 py-3 text-white font-semibold transition-all shadow-none">
                        <Search className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection