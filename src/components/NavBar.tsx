import React from "react";

const NavBar:React.FC =() =>{

    return(
        <nav className=" bg-gradient-to-r from-[#5B5B5B] to-[#4C4444] w-screen h-1/12 bg-stone-900 fixed top-0 left-0 z-50 shadow-md flex items-center px-4 text-white font-extrabold flex flex-line">
            {"ALBINO TASKS"}
            <img className={"ml-auto h-6 w-6"} src={"./public/user.svg"}></img>
        </nav>

    )

}

export default NavBar;