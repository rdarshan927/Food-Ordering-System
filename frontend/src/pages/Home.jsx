const Home = () => {
  const role = localStorage.getItem("role");

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to the Food Delivery System 🍔</h2>

      {role ? (
        <p className="text-green-600">
          You are logged in as <strong>{role}</strong>
        </p>
      ) : (
        <p className="text-gray-700">
          Please login or register to continue.
        </p>
      )}
    </div>
  );
};

export default Home;
