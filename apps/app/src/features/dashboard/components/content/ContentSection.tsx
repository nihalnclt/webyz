import { useState } from "react";
import TopPagesTab from "./TopPagesTab";

const tabs = ["pages", "entries", "exits"];

export default function ContentSection() {
  const [activeTab, setActiveTab] = useState("pages");

  return (
    <div>
      <div className="flex items-center gap-6 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`capitalize ${
              activeTab === tab ? "font-semibold border-b-2 border-black" : ""
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "pages" && <TopPagesTab />}
        {/* {activeTab === "entries" && <TopEntriesTab />} */}
        {/* {activeTab === "exits" && <TopExitsTab />} */}
      </div>
    </div>
  );
}
