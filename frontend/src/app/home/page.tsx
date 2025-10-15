function Home() {
  return (
    <div className="w-full h-full">
      <div className="max-w-7xl mx-auto py-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Welcome back, John 👋
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Card {i}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Quick overview and details go here.
                  </p>
                </div>
                <div className="text-sky-600 text-3xl font-bold">{i * 3}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-800">Recent activity</h4>
            <div className="mt-4 text-sm text-gray-500">
              No recent activity to show.
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h4 className="font-semibold text-gray-800">Announcements</h4>
            <div className="mt-4 text-sm text-gray-500">No announcements.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
