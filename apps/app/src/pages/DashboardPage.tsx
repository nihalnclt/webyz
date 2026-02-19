import {
  BarChart,
  Download,
  Moon,
  Globe,
  MoreVertical,
  TrendingUp,
} from "lucide-react";

import LineChart from "../features/dashboard/components/LineChart";
import ContentSection from "../features/dashboard/components/content/ContentSection";

export default function DashboardPage() {
  return (
    <div>
      <div className="w-[1120px] max-w-[100%] mx-auto py-5 flex items-center justify-between">
        <h1 className="font-[600] text-xl">WEBYZ</h1>
        <div className="flex items-center gap-6">
          <button className="text-[22px]">
            <Globe />
          </button>
          <button className="text-[22px]">
            <Moon />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden bg-[#f1f1f1]">
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
        </div>
      </div>

      <div className="bg-[#fff] sticky top-0">
        <div className="w-[1120px] max-w-[100%] mx-auto flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <img
              src="https://www.svgrepo.com/show/373632/go.svg"
              alt=""
              className="w-[20px] h-[20px] object-cover"
            />
            <span>webyz.io</span>
          </div>
          <div className="flex items-center gap-4">
            <button>
              <Download />
            </button>
            <button>Filters</button>
            <select name="" id="">
              <option value="">Today</option>
              <option value="">Yesterday</option>
            </select>
            <button>
              <MoreVertical />
            </button>
          </div>
        </div>
      </div>

      <div className="w-[1120px] max-w-[100%] mx-auto">
        <div className="grid grid-cols-6 gap-3 border-t border-b py-4">
          {Array.from({ length: 6 }).map((_, index) => {
            return (
              <div key={index} className="flex items-center gap-4 border-r">
                {/* <div className="w-[40px] h-[40px] rounded-full bg-[#f1f1f1]"></div> */}
                <div>
                  <span>Total Views</span>
                  <div className="flex items-center justify-between">
                    <span>18</span>
                    <div className="flex items-center gap-2 text-green-500 text-sm">
                      <TrendingUp />
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-5 w-full h-[500px]">
          <div className="col-span-4">
            <div className="flex items-center gap-4 justify-end">
              <button>
                <BarChart />
              </button>
              <select name="" id="">
                <option value="">Hour</option>
                <option value="">Min</option>
              </select>
            </div>
            <LineChart />
          </div>
          <div className="w-full h-full ">
            <div className="py-4 border-b flex items-center gap-4 justify-between">
              <div>
                <span className="block text-sm">Top OS</span>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="https://cdn.iconscout.com/icon/free/png-256/free-windows-221-1175066.png"
                    alt=""
                    className="w-[20px] h-[20px] object-cover"
                  />
                  <span className="block">Windows 11</span>
                </div>
              </div>
              <span className="text-lg font-[500]">21K</span>
            </div>
            <div className="py-4 border-b flex items-center gap-4 justify-between">
              <div className="">
                <span className="block text-sm">Top Device</span>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3381/3381949.png"
                    alt=""
                    className="w-[20px] h-[20px] object-cover"
                  />
                  <span className="block">Desktop</span>
                </div>
              </div>
              <span className="text-lg font-[500]">21K</span>
            </div>
            <div className="py-4 border-b flex items-center gap-4 justify-between">
              <div>
                <span className="block text-sm">Top Browser</span>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/8/87/Google_Chrome_icon_%282011%29.png"
                    alt=""
                    className="w-[20px] h-[20px] object-cover"
                  />
                  <span className="block">Chrome</span>
                </div>
              </div>
              <span className="text-lg font-[500]">21K</span>
            </div>
            <div className="py-4 flex items-center gap-4 justify-between">
              <div>
                <span className="block text-sm">Top Country</span>
                <div className="flex items-center gap-3 mt-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/255px-Flag_of_India.svg.png"
                    alt=""
                    className="w-[20px] h-[20px] object-cover"
                  />
                  <span className="block">India</span>
                </div>
              </div>
              <span className="text-lg font-[500]">21K</span>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2">
          <ContentSection />
          <div className="pr-5 border-r">
            <h2>Top Pages</h2>
            <div className="flex items-center gap-4">
              <span>Top Pages</span>
              <span>Entries</span>
              <span>Exits</span>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {Array.from({ length: 10 }).map((_, index) => {
                return (
                  <div
                    key={index}
                    className={"flex items-center gap-4 justify-between"}
                  >
                    <div className="flex-1">
                      <span>/Dashboard</span>
                    </div>
                    <span>12k</span>
                    <div className="w-[50px] h-[4px] bg-red-500 rounded-full">
                      <span className=""></span>
                    </div>
                    {/* <span>{(10 - index) * 8}%</span> */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="pl-5">
            <h2>Top Source</h2>
            <div className="flex items-center gap-4">
              <span>All</span>
              <span>Urls</span>
              <span>Types</span>
              <span>Source</span>
            </div>
            <div className="flex flex-col gap-3 w-full">
              {Array.from({ length: 10 }).map((_, index) => {
                return (
                  <div
                    key={index}
                    className={"flex items-center gap-4 justify-between"}
                  >
                    <div className="flex-1">
                      <span>Google</span>
                    </div>
                    <span>12k</span>
                    <div className="w-[50px] h-[4px] bg-red-500 rounded-full">
                      <span className=""></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
