import { useTopPages } from "../../hooks/useContentData";

type TopPagesModalProps = {
  onClose: () => void;
};

export default function TopPagesModal({ onClose }: TopPagesModalProps) {
  const { data, isLoading } = useTopPages(true);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-175 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">All Top Pages</h2>
          <button onClick={onClose}>Close</button>
        </div>

        <div className="mt-4 max-h-100 overflow-y-auto">
          {isLoading && <p>Loading...</p>}

          {data?.data?.results?.map((item: any) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <span>{item.page}</span>
              <span>{item.visitors}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
