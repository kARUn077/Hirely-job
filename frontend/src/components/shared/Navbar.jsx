import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#e5d3c2] shadow-sm">
            <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-8">
                <div className="flex items-center gap-3">
                    <img src="https://img.icons8.com/color/48/000000/job.png" alt="Hirely Logo" className="w-10 h-10 drop-shadow-md" />
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900 cursor-pointer select-none" onClick={() => navigate("/")}>Hi<span className="text-[#8B5C2A]">rely</span></span>
                </div>
                <input type="checkbox" id="menu-toggle" className="hidden peer" />
                <label htmlFor="menu-toggle" className="md:hidden block cursor-pointer p-2 rounded-lg hover:bg-[#F5E9DA] transition">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </label>
                <ul className="flex-col md:flex-row md:flex font-medium items-center gap-5 md:gap-8 fixed md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow md:shadow-none transition-all duration-300 ease-in-out hidden peer-checked:flex md:flex rounded-b-xl md:rounded-none border-b md:border-0">
                    {user && user.role && user.role.trim().toLowerCase() === 'recruiter' ? (
                        <>
                            <li><Link to="/admin/companies" className="relative hover:text-[#8B5C2A] text-gray-800 transition after:content-[''] after:block after:h-0.5 after:bg-[#8B5C2A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left">Companies</Link></li>
                            <li><Link to="/admin/jobs" className="relative hover:text-[#8B5C2A] text-gray-800 transition after:content-[''] after:block after:h-0.5 after:bg-[#8B5C2A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left">Jobs</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/" className="relative hover:text-[#8B5C2A] text-gray-800 transition after:content-[''] after:block after:h-0.5 after:bg-[#8B5C2A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left">Home</Link></li>
                            <li><Link to="/jobs" className="relative hover:text-[#8B5C2A] text-gray-800 transition after:content-[''] after:block after:h-0.5 after:bg-[#8B5C2A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left">Jobs</Link></li>
                            <li><Link to="/browse" className="relative hover:text-[#8B5C2A] text-gray-800 transition after:content-[''] after:block after:h-0.5 after:bg-[#8B5C2A] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left">Browse</Link></li>
                        </>
                    )}
                    {!user ? (
                        <div className="flex items-center gap-2 mt-3 md:mt-0">
                            <Link to="/login">
                                <Button variant="outline" className="rounded-full border-[#8B5C2A] text-[#8B5C2A] hover:bg-[#F5E9DA] hover:border-[#8B5C2A] shadow-sm transition">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="rounded-full bg-[#8B5C2A] hover:bg-[#704214] shadow-md transition text-white">Signup</Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-[#F5E9DA] transition shadow-sm text-gray-800">
                                    <Avatar>
                                        <AvatarImage src={user?.profile?.profilePhoto || undefined} />
                                        <AvatarFallback>
                                            <img src="/default-user.png" alt="user" className="h-full w-full object-cover" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="hidden md:inline font-semibold text-gray-800">{user?.fullname}</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent align="end" className="w-52 rounded-xl shadow-xl border border-[#e5d3c2] bg-white">
                                <div className="flex flex-col gap-2 py-2">
                                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5E9DA] hover:text-[#8B5C2A] transition"><User2 className="w-4 h-4" /> Profile</Link>
                                    <Button variant="ghost" className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg" onClick={logoutHandler}><LogOut className="w-4 h-4" /> Logout</Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;