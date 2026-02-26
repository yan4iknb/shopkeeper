import ProductCard from "./ProductCard";

export default function Catalog() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Левая колонка */}
      <aside className="w-64 bg-white p-6 border-r">
        <h2 className="text-xl font-semibold mb-6">
          Фильтры
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Бренд
            </label>
            <select className="w-full border rounded p-2">
              <option>Все</option>
              <option>Antminer</option>
              <option>Whatsminer</option>
              <option>IceRiver</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Алгоритм
            </label>
            <select className="w-full border rounded p-2">
              <option>Все</option>
              <option>SHA-256</option>
              <option>Scrypt</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Правая часть */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">
          Каталог товаров
        </h1>

        <div className="grid grid-cols-3 gap-6">
          <ProductCard
            name="Antminer S21"
            hashRate="200 TH/s"
            power="3500W"
            price="2 450 USDT"
          />

          <ProductCard
            name="Whatsminer M60"
            hashRate="190 TH/s"
            power="3400W"
            price="2 300 USDT"
          />
        </div>
      </main>

    </div>
  );
}