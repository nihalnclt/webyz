import { useState } from "react";
import { useTopPages } from "../../hooks/useContentData";
import TopPagesModal from "./TopPagesModal";

export default function TopPagesTab() {
  const { data, isLoading } = useTopPages(true);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Top Pages</h2>
        <button onClick={() => setOpen(true)} className="text-sm text-blue-500">
          View More
        </button>
      </div>

      <div className="mt-4">
        <div className="flex font-medium border-b pb-2">
          <span className="flex-1">Page</span>
          <span>Visitors</span>
        </div>

        {isLoading && <p>Loading...</p>}

        {data?.slice(0, 5).map((item: any) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <span className="flex-1">{item.name}</span>
            <span>{item.count}</span>
          </div>
        ))}
      </div>

      {open && <TopPagesModal onClose={() => setOpen(false)} />}
    </div>
  );
}
