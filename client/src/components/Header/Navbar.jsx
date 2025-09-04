import { Link } from "react-router-dom";
import React from "react";
import { fetchTestImage } from "../../utils/api";

function Navbar() {
  return (
      <nav>
        <ul>

          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to="/about">About</Link>
          </li>
          
          <li>
            <Link to="/more">More</Link>
          </li>

          <li>
            <div onClick={()=> {console.log(fetchTestImage())}}>askdjahsdkjsa</div>
          </li>

        </ul>
      </nav>
  );
}

export default Navbar;
