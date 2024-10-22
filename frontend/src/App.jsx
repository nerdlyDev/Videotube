import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import CategoryPill from "./components/CategoryPill";
import VideoItem from "./components/VideoItem";
import { categories, videos } from "./constents/index";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // Effect hook to show sidebar on large devices initially
  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true);
  }, []);

  return (
    <>
      <div className="max-h-screen flex flex-col overflow-hidden dark:bg-neutral-950">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="flex overflow-auto">
          <Sidebar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
          {/* Overlay for mobile to close sidebar */}
          <div
            onClick={toggleSidebar}
            className={`md:hidden ${
              !isSidebarOpen && "opacity-0 pointer-events-none"
            } transition-all bg-black bg-opacity-50 h-screen w-full fixed left-0 top-0 z-20`}
          ></div>
          <div
            className={`w-full px-4 overflow-x-hidden custom_scrollbar ${
              isSidebarOpen && "hide_thumb"
            }`}
          >
            {/* Category list */}
            <div className="sticky bg-white top-0 z-10 pb-3 flex gap-3 overflow-y-auto no_scrollbar dark:bg-neutral-900">
              {categories.map((category) => (
                <CategoryPill key={category} category={category} />
              ))}
            </div>
            {/* Video grid */}
            <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] mt-5 pb-6">
              {videos.map((video) => (
                <VideoItem key={video.id} video={video} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
