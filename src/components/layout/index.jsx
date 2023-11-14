import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="relative">
      <Header />
      <main className="mx-auto  px-4 sm:px-6 lg:px-8 pt-10 mt-[64px] pb-20">
        {children}
      </main>
    </div>
  );
}

export default Layout;
