type Props = {
  active: string;
  onChange: (value: string) => void;
};

const tabs = ["pages", "entries", "exits"];

export default function TopTabs({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-6 border-b pb-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`capitalize ${
            active === tab ? "font-semibold border-b-2 border-black" : ""
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
