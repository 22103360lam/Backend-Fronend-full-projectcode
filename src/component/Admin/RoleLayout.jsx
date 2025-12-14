
// Layouts
import Nav from "./Nav";
import Header from "./Header";

export default function Admin({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      <Nav />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header />
        {children}
      </main>
    </div>
  );
}