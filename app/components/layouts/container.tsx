import Contact from "~/components/form/contact";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="px-10 relative">
      {children}
      <Contact />
    </main>
  );
};

export default Container;
