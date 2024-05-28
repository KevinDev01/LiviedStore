import Contact from "~/components/form/contact";
import Navbar from "./navbar";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="px-5 relative">
      {children}
      <Contact />
    </main>
  );
};

export default Container;
