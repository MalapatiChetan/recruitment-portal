import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 bg-opacity-90 backdrop-blur-lg shadow-xl sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-3xl font-bold text-white tracking-wide drop-shadow-md">
                            Job<span className="text-pink-400">Portal</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-10">
                        <ul className="flex items-center gap-8 text-base font-semibold text-white">
                            {user && user.role === 'recruiter' ? (
                                <>
                                    <li>
                                        <Link
                                            to="/admin/companies"
                                            className="relative px-2 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-50 transition-all duration-300 group"
                                        >
                                            Companies
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/admin/jobs"
                                            className="relative px-2 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-50 transition-all duration-300 group"
                                        >
                                            Jobs
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            to="/"
                                            className="relative px-2 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-50 transition-all duration-300 group"
                                        >
                                            Home
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/jobs"
                                            className="relative px-2 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-50 transition-all duration-300 group"
                                        >
                                            Jobs
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link
                                            to="/browse"
                                            className="relative px-2 py-1 rounded-md hover:bg-purple-700 hover:bg-opacity-50 transition-all duration-300 group"
                                        >
                                            Browse
                                            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                                        </Link>
                                    </li> */}
                                </>
                            )}
                        </ul>
                        {!user ? (
                            <div className="flex items-center gap-4">
                                <Link to="/login">
                                    <Button
                                        variant="outline"
                                        className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white transition-all duration-300 transform hover:scale-105 px-5 py-2 rounded-full shadow-md"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button
                                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 transform hover:scale-105 px-5 py-2 rounded-full shadow-md"
                                    >
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer w-12 h-12 ring-2 ring-pink-400 hover:ring-pink-300 transition-all duration-300 transform hover:scale-110">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-white bg-opacity-95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-purple-200">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-4 mb-5">
                                            <Avatar className="w-14 h-14 ring-2 ring-purple-300">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">{user?.fullname}</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {user && user.role === 'student' && (
                                                <div className="flex items-center gap-3 hover:bg-purple-100 hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                                                    <User2 className="w-5 h-5 text-purple-600" />
                                                    <Button
                                                        variant="link"
                                                        asChild
                                                        className="text-gray-800 hover:text-purple-600 p-0 font-medium"
                                                    >
                                                        <Link to="/profile">View Profile</Link>
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 hover:bg-purple-100 hover:bg-opacity-50 p-3 rounded-lg transition-all duration-200">
                                                <LogOut className="w-5 h-5 text-purple-600" />
                                                <Button
                                                    variant="link"
                                                    onClick={logoutHandler}
                                                    className="text-gray-800 hover:text-purple-600 p-0 font-medium"
                                                >
                                                    Logout
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar