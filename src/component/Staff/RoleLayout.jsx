import Snav from "./Snav";
import Sheader from "./Sheader";

export default function Staff({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      <Snav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Sheader />
        {children}
      </main>
    </div>
  );
}