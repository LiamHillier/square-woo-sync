import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="relative">
      <Header />
      <main className="mx-auto pb-20 mt-10">{children}</main>
    </div>
  );
}

export default Layout;
