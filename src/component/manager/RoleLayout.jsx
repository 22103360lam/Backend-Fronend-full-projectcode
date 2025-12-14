import Mnav from "./Mnav";
import Mheader from "./Mheader";

export default function Manager({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      <Mnav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Mheader />
        {children}
      </main>
    </div>
  );
}