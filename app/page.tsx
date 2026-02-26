import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white">
      <h1 className="text-5xl font-bold">
        Shopkeeper 🚀
      </h1>

      <p className="text-xl text-gray-600 text-center max-w-2xl">
        Платформа международных поставок технологического оборудования
      </p>

      <Link
        href="/catalog"
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Перейти в каталог
      </Link>
    </main>
  );
}