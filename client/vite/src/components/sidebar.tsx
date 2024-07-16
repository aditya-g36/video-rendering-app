import React, { useState, useContext } from "react";
import { MdOutlineDashboard, MdLogout } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineLiveTv } from "react-icons/md";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import StreamForm from "./StreamForm"; // Import the new StreamForm component
import PostForm from "./PostForm";
import { IoCreateOutline } from "react-icons/io5";

const Sidebar = () => {
  let { user, logoutUser } = useContext(AuthContext);
  const [showStreamForm, setShowStreamForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const menus = [
    { name: "Home", link: "/", icon: MdOutlineDashboard },
    { name: "Profile", link: `/profile/${user.user_id}`, icon: AiOutlineUser },
    { name: "Messages", link: "/", icon: FiMessageSquare },
    { name: "Setting", link: "/", icon: RiSettings4Line },
  ];
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed ">
      <section
        className="flex gap-6"
        style={{
          height: 50,
        }}
      >
        <div className="min-h-screen w-16 lg:w-96 duration-500 text-gray-100 px-4">
          <div
            className={` min-h-screen${
              open ? "w-16 lg:w-40 lg:ml-20" : "w-16"
            } duration-500 text-gray-100 px-4`}
          >
            <div className="py-3 flex">
              <h2>Tegami</h2>
            </div>
            <div className="mt-4 flex flex-col gap-4 relative">
              {menus?.map((menu, i) => (
                <Link
                  to={menu?.link}
                  key={i}
                  className={`${
                    open
                      ? "group flex items-center text-lg  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
                      : " py-3 flex justify-end cursor-pointer hover:bg-gray-800 rounded-md"
                  }`}
                  style={{ color: "#FFF" }}
                >
                  <div>{React.createElement(menu?.icon, { size: "19" })}</div>
                  <div
                    style={{
                      transitionDelay: `${i + 2}00ms`,
                    }}
                    className={`whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    {menu?.name}
                  </div>
                  <div
                    className={`${
                      open && "hidden"
                    } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                  >
                    {menu?.name}
                  </div>
                </Link>
              ))}
              <button
                onClick={() => setShowStreamForm(true)}
                className="group flex items-center text-lg gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
                style={{ color: "#FFF" }}
              >
                <div>
                  {React.createElement(MdOutlineLiveTv, { size: "19" })}
                </div>
                <div
                  style={{
                    transitionDelay: `${8}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Go Live
                </div>
              </button>

              <button
                onClick={() => setShowPostForm(true)}
                className="group flex items-center text-lg gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
                style={{ color: "#FFF" }}
              >
                <div>
                  {React.createElement(IoCreateOutline, { size: "19" })}
                </div>
                <div
                  style={{
                    transitionDelay: `${8}00ms`,
                  }}
                  className={`whitespace-pre duration-500 ${
                    !open && "opacity-0 translate-x-28 overflow-hidden"
                  }`}
                >
                  Post
                </div>
              </button>

              <Link to="/login" onClick={logoutUser} style={{ color: "#FFF" }}>
                <div
                  className={`${
                    open
                      ? "group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md"
                      : " py-3 flex justify-end cursor-pointer hover:bg-gray-800 rounded-md"
                  }`}
                >
                  <div>{React.createElement(MdLogout, { size: "19" })}</div>
                  <div
                    style={{
                      transitionDelay: `${8}00ms`,
                    }}
                    className={`whitespace-pre duration-500 ${
                      !open && "opacity-0 translate-x-28 overflow-hidden"
                    }`}
                  >
                    LogOut
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {showStreamForm && (
        <StreamForm onClose={() => setShowStreamForm(false)} />
      )}

      {showPostForm && (
        <PostForm onClose={() => setShowPostForm(false)} />
      )}

    </div>
  );
};

export default Sidebar;
