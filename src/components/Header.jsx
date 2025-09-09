import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';   
import api from '../services/api';

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [image,setImage] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [fullname ,setFullname] = useState('')
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 0
  );

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const token = Cookies.get('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await api.get('/all-Details/C-U', {
          headers: {
             Authorization: `Bearer ${token}`
          }
        });
        const userInfo = res.data?._doc;
        const profileImg = res.data?.image;

        if (userInfo) {
          setFullname(userInfo.fullname || 'guest');
          setUsername(userInfo.username || 'guest');
          setImage(profileImg);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (isLoading) {
    return (
      <header className="px-4 py-3 bg-zinc-950 text-white">
        <div className="flex items-center justify-center h-16">
          <span>Loading...</span>
        </div>
      </header>
    );
  }

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined" && typeof Cookies !== "undefined") {
        Cookies.remove('token');
        Cookies.remove('user');
        navigate('/login');
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-16 px-4 py-3 bg-zinc-950 text-white z-50 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 ml-2">
          
          {/* Logo/Username section */}
          <Link to='/user/profile' className="flex items-center cursor-pointer">
            {image ? (
              <img
                src={ image }
                width={36}
                height={36}
                alt="User icon"
                className="invert rounded-full object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 flex items-center justify-center rounded-full bg-violet-300 text-black font-bold text-lg"
                aria-label="Profile initial"
                title={fullname ? fullname : 'Guest'}
              >
                {fullname ? fullname[0] : 'G'}
              </div>
            )}
            <span className="ml-3 text-lg font-bold text-white truncate max-w-[200px]">
              {windowWidth > 500
                ? `Welcome ${username ? username : 'Guest'}!`
                : username ? username : 'Guest'}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;