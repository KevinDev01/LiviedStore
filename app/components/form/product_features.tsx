import Input from "./input";

const ProductFeatures = ({
  features,
  handleChangeFeatureInput,
}: {
  features: any;
  handleChangeFeatureInput: any;
}) => {
  return (
    <>
      {features.length > 0 && <p>Características del producto</p>}
      <div className="grid grid-cols-2 items-center gap-x-3 gap-y-8">
        {features.length > 0 ? (
          features.map((feature: any) => (
            <Input
              key={feature}
              id={feature}
              name={feature}
              label={`Ingresa ${feature}`}
              description={`Ingresa el valor del apartado ${feature}`}
              type="text"
              width="1/2"
              handleChange={(e) => handleChangeFeatureInput(e, feature)}
            />
          ))
        ) : (
          <p>Selecciona una categoria antes</p>
        )}
      </div>
    </>
  );
};

export default ProductFeatures;
