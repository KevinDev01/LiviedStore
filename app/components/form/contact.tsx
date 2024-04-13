import { Link, useLocation } from "@remix-run/react";
import { RiWhatsappFill } from "react-icons/ri";

const Contact = () => {
  const location = useLocation();
  return (
    <Link
      target="_blank"
      className="bg-green-200 p-2 w-fit h-fit rounded-full shadow-xl fixed bottom-10 right-6"
      to={`https://wa.me/6622265074?text=¡Hola!%20Estoy%20interesado/a%20en%20obtener%20más%20información%20sobre%20los%20servicios/productos%20ofrecidos%20en%20Livied.%20¿Podrían%20proporcionarme%20detalles%20adicionales?%20¡Gracias!
`}>
      <RiWhatsappFill size={40} className="text-green-600 mx-auto" />
    </Link>
  );
};

export default Contact;
