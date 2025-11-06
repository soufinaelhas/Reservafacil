export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary">ReservaFácil</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestión de citas simplificada
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}
