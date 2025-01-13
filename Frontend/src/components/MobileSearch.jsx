import { useEffect, useRef, useState } from 'react';
import searchImg from '../assets/search.svg';
import {Link, useNavigate} from 'react-router-dom';

const MobileSearch = (props) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const searchRef = useRef(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (search) {
      navigate(`/search?query=${encodeURIComponent(search.trim())}`);
      props.closeSearch();
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className="w-full h-full relative top-0 left-0">
        <div
          id="searchBar"
          className="border-b border-gray-300 flex justify-center items-center h-[64px] p-4 bg-white z-50"
        >
          <input
            ref={searchRef}
            value={search}
            onBlur={props.closeSearch}
            onKeyDown={(e) => e.key === 'Enter' ? handleSearch() : ''}
            onChange={(e) =>setSearch(e.target.value)}
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none w-full h-full mx-4"
          />
          
          {/* <img
            onClick={()=>{
              searchRef.current.focus();
              handleSearch();
            }}
            src={searchImg}
            className="cursor-pointer"
            alt="Search icon"
          /> */}
        </div>
        <div className="h-full w-full z-40 bg-gray-500 opacity-40"></div>
      </div>
    );
  }

  return null;
};

export default MobileSearch;
