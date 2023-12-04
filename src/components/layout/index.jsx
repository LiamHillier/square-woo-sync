import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="relative">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-10">
        {children}
      </main>
    </div>
  );
}

export default Layout;
