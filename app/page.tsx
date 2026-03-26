export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <section className="text-center">
        <h1 className="text-4xl font-bold" role="heading" aria-level={1}>
          Setup OK
        </h1>
        <p className="mt-4 text-lg text-gray-300" role="contentinfo">
          TribeHub está listo para conectar con el mundo
        </p>
      </section>
    </div>
  );
}
