import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 bg-darkBg text-textWhite">
      <div className="text-lg font-bold text-primaryPurple">Pro Insight</div>
      <div className="space-x-5">
        <Link to="/" className="hover:text-secondaryPurple">Home</Link>
        <Link to="/output" className="hover:text-secondaryPurple">Output</Link>
        <Link to="/upload" className="hover:text-secondaryPurple">Upload</Link>
      </div>
    </nav>
  );
}

export default Navbar;
