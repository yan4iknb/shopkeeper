type ProductCardProps = {
  name: string;
  hashRate: string;
  power: string;
  price: string;
};

export default function ProductCard({
  name,
  hashRate,
  power,
  price,
}: ProductCardProps) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">
        {name}
      </h3>
      <p className="text-gray-600 mb-4">
        {hashRate} • {power}
      </p>
      <p className="font-bold text-xl">
        {price}
      </p>
    </div>
  );
}