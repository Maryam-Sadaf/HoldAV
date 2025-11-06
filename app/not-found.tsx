export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Siden ble ikke funnet</h1>
        <p className="mt-2 text-sm text-gray-500">
          Vi klarte ikke å finne siden du lette etter.
        </p>
      </div>
    </div>
  );
}

