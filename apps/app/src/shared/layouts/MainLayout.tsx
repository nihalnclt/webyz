import { Globe, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

import { useLogout } from "../../features/auth/hooks/useAuth";

export default function MainLayout() {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: logout, isPending } = useLogout();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout({} as any, {
      onSuccess: () => {
        queryClient.clear(); // remove cached user
        navigate("/login");
      },
      onError: (err) => {
        console.log("logout error", err);
      },
    });
    // TODO: call logout API
  };

  return (
    <div>
      <div className="w-280 max-w-full mx-auto py-5 flex items-center justify-between">
        <h1 className="font-semibold text-xl">WEBYZ</h1>
        <div className="flex items-center gap-6">
          <button className="text-[22px]">
            <Globe />
          </button>
          <button className="text-[22px]">
            <Moon />
          </button>
          <div className="relative">
            <div
              className="flex items-center gap-3"
              onClick={() => setOpen(!open)}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-[#f1f1f1]">
                <img
                  src="https://newprofilepic.photo-cdn.net//assets/images/article/profile.jpg?90af0c8"
                  alt=""
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <span className="block">Nihal N</span>
                <span className="block text-sm">nihal@gmail.com</span>
              </div>
            </div>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white border rounded-xl shadow-lg p-2 z-50">
                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    console.log("go to settings");
                  }}
                >
                  Settings
                </button>

                <button
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
