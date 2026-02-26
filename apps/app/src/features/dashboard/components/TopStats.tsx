import { TrendingDown, TrendingUp } from "lucide-react";
import { useTopStats } from "../hooks/useOverview";

export default function TopStats() {
  const { data, isLoading } = useTopStats();

  return (
    <div className="grid grid-cols-6 gap-3 border-t border-b py-4">
      {data?.data?.top_stats?.map((item, index) => {
        const isUp = item.change >= 0;

        return (
          <div
            key={index}
            className="flex items-center gap-4 border-r last:border-r-0 pr-3"
          >
            <div className="w-full">
              <span className="text-sm text-muted-foreground">{item.name}</span>

              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-semibold">{item.value}</span>

                <div
                  className={`flex items-center gap-1 text-sm ${
                    isUp ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>{Math.abs(item.change)}%</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
