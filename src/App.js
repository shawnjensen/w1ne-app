import React, { useState, useEffect } from "react";
import {
  Wine,
  MapPin,
  Search,
  Loader2,
  ChevronRight,
  Star,
  X,
  Bookmark,
  Send,
  MessageCircle,
  Plus,
  User,
  LogOut,
  Heart,
  Play,
  Camera,
  Globe,
} from "lucide-react";

// CodeSandbox Compatibility: Add window.storage API
if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    async get(key) {
      const value = localStorage.getItem(key);
      return value ? { key, value, shared: false } : null;
    },
    async set(key, value) {
      localStorage.setItem(key, value);
      return { key, value, shared: false };
    },
    async delete(key) {
      localStorage.removeItem(key);
      return { key, deleted: true, shared: false };
    },
    async list(prefix = "") {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) keys.push(key);
      }
      return { keys, prefix, shared: false };
    },
  };
}

function App() {
  // State declarations
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAgeGate, setShowAgeGate] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [view, setView] = useState('chat');
  const [staticPage, setStaticPage] = useState(null);

  // Add Tailwind CSS
  useEffect(() => {
    if (!document.getElementById('tailwind-css')) {
      const script = document.createElement('script');
      script.id = 'tailwind-css';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  // Call checkUserSession on mount
  useEffect(() => {
    checkUserSession();
  }, []);

  // Helper functions (moving them inside App so they have access to state)
  function checkUserSession() {
    const user = localStorage.getItem('w1ne_user');
    const verified = localStorage.getItem('w1ne_age_verified');
    const region = localStorage.getItem('w1ne_selected_region');
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        
        if (userData.ageVerified && userData.region) {
          setSelectedRegion(userData.region);
          setShowAgeGate(false);
        } else if (verified && region) {
          setSelectedRegion(region);
          setShowAgeGate(false);
        } else {
          setShowAgeGate(true);
        }
      } catch (e) {
        console.error('Error parsing user:', e);
        setShowAgeGate(true);
      }
    } else if (!verified) {
      setShowAgeGate(true);
    } else if (region) {
      setSelectedRegion(region);
    }
  }

  function handleAgeVerified(region) {
    localStorage.setItem('w1ne_age_verified', 'true');
    localStorage.setItem('w1ne_selected_region', region);
    
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        ageVerified: true,
        region: region
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('w1ne_user', JSON.stringify(updatedUser));
    }
    
    setSelectedRegion(region);
    setShowAgeGate(false);
  }

  function handleSignOut() {
    localStorage.removeItem("w1ne_user");
    localStorage.removeItem("w1ne_age_verified");
    localStorage.removeItem("w1ne_selected_region");
    localStorage.removeItem("w1ne_mock_code");
    setCurrentUser(null);
    setSelectedRegion(null);
    setShowAgeGate(true);
    setView("chat");
  }
  if (showAgeGate) {
  return (
    <AgeGateWithRegion 
      onVerified={handleAgeVerified}
      onShowAuth={() => {
        setShowAgeGate(false);
        setShowAuthModal(true);
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #000 0%, #333 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .chat-message {
          animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hover-lift {
          transition: transform 0.2s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
        }
        
        .logo-image {
          filter: invert(0);
        }
      `}</style>

      {/* Header */}
      <Header
        currentUser={currentUser}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleSignOut}
        selectedRegion={selectedRegion}
        onNavigate={(viewName) => setView(viewName)}
        currentView={view}
      />

      {/* Main Content */}
      <main>
        {view === "chat" && (
          <ClaudeChatInterface
            selectedRegion={selectedRegion}
            currentUser={currentUser}
            onRequireAuth={() => setShowAuthModal(true)}
          />
        )}

        {view === "discover" && (
          <DiscoverView
            selectedRegion={selectedRegion}
            currentUser={currentUser}
            onRequireAuth={() => setShowAuthModal(true)}
          />
        )}

        {view === "winetube" && (
          <WinetubeView
            selectedRegion={selectedRegion}
            currentUser={currentUser}
            onRequireAuth={() => setShowAuthModal(true)}
          />
        )}

        {view === "bookmarks" && (
          <BookmarksView
            currentUser={currentUser}
            onRequireAuth={() => setShowAuthModal(true)}
          />
        )}

        {view === "admin" && (
          <AdminDashboard
            currentUser={currentUser}
            onRequireAuth={() => setShowAuthModal(true)}
          />
        )}
      </main>
{/* Footer */}
      {!showAgeGate && (
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
              <button onClick={() => setStaticPage('about')} className="hover:text-black transition">
                About Us
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => setStaticPage('impressum')} className="hover:text-black transition">
                Impressum
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => setStaticPage('privacy')} className="hover:text-black transition">
                Privacy Policy
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => setStaticPage('cookies')} className="hover:text-black transition">
                Cookie Policy
              </button>
              <span className="text-gray-300">•</span>
              <button onClick={() => setStaticPage('terms')} className="hover:text-black transition">
                Terms of Use
              </button>
            </div>
            <div className="text-center mt-4 text-xs text-gray-400">
              © 2026 W1NE. All rights reserved.
            </div>
          </div>
        </footer>
      )}

      {staticPage && (
        <StaticPage page={staticPage} onClose={() => setStaticPage(null)} />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            setShowAuthModal(false);
          }}
        />
      )}
    </div>
  );
}

function Header({
  currentUser,
  onSignIn,
  onSignOut,
  selectedRegion,
  onNavigate,
  currentView,
}) {
  const logoUrl =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // Placeholder

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("chat")}
            className="text-3xl font-black tracking-tighter hover:opacity-70 transition"
          >
            W1NE
          </button>
          {selectedRegion && (
            <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
              <Globe className="w-3 h-3" />
              {selectedRegion}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("discover")}
            className={`text-sm font-medium hover:text-gray-600 transition ${
              currentView === "discover" ? "text-black" : "text-gray-500"
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onNavigate("winetube")}
            className={`text-sm font-medium hover:text-gray-600 transition ${
              currentView === "winetube" ? "text-black" : "text-gray-500"
            }`}
          >
            Winetube
          </button>

          {currentUser && currentUser.email.includes("admin") && (
            <button
              onClick={() => onNavigate("admin")}
              className={`text-sm font-medium hover:text-gray-600 transition ${
                currentView === "admin" ? "text-black" : "text-gray-500"
              }`}
            >
              Admin
            </button>
          )}

          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate("bookmarks")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentUser.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

function LandingPage({ onStartChat }) {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h1 className="text-7xl font-black mb-6 tracking-tight leading-tight">
          Find Wine.
          <br />
          <span className="gradient-text">Ask W1NE.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Discover wine, anywhere.
        </p>

        <button
          onClick={onStartChat}
          className="px-8 py-4 bg-black text-white rounded-2xl text-lg font-semibold hover:bg-gray-800 transition hover-lift inline-flex items-center gap-3"
        >
          <MessageCircle className="w-5 h-5" />
          Ask W1NE
        </button>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gray-50 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Chat with W1NE</h3>
            <p className="text-gray-600">
              "I want a wine bar in Zurich that serves natural Pinot Noir"
            </p>
          </div>

          <div className="text-center p-8 bg-gray-50 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Get Smart Matches</h3>
            <p className="text-gray-600">
              W1NE finds the perfect spots based on your exact preferences
            </p>
          </div>

          <div className="text-center p-8 bg-gray-50 rounded-3xl hover-lift">
            <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Save & Go</h3>
            <p className="text-gray-600">
              Bookmark places and wines you love. Go explore in real life.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-black mb-4">W1NE</h3>
              <p className="text-sm text-gray-600">
                Discover wine, anywhere. Powered by AI, trusted by wine lovers.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#discover" className="hover:text-black transition">
                    Discover
                  </a>
                </li>
                <li>
                  <a href="#winetube" className="hover:text-black transition">
                    Winetube
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-black transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-black transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#about" className="hover:text-black transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-black transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#careers" className="hover:text-black transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-black transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="#privacy" className="hover:text-black transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#terms" className="hover:text-black transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#cookies" className="hover:text-black transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © 2025 W1NE. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                href="#twitter"
                className="text-gray-600 hover:text-black transition text-sm"
              >
                Twitter
              </a>
              <a
                href="#instagram"
                className="text-gray-600 hover:text-black transition text-sm"
              >
                Instagram
              </a>
              <a
                href="#facebook"
                className="text-gray-600 hover:text-black transition text-sm"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ADMIN DASHBOARD COMPONENT GOES HERE

// Insert this component before BookmarksView in W1NE-Complete.jsx

function AdminDashboard({ currentUser, onRequireAuth }) {
  const [tab, setTab] = useState("videos"); // videos, entities, users, data
  const [videos, setVideos] = useState([]);
  const [entities, setEntities] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingEntity, setEditingEntity] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(null);

  const isMasterAdmin =
    currentUser &&
    (currentUser.email.includes("admin@") ||
      currentUser.email === "admin@w1ne.com");
  const isEntityAdmin = currentUser && !isMasterAdmin;

  useEffect(() => {
    if (!currentUser || !currentUser.email.includes("admin")) {
      alert("Admin access only");
      return;
    }
    loadData();
  }, [tab]);

  async function loadData() {
    setLoading(true);
    try {
      if (tab === "videos") {
        await loadVideos();
      } else if (tab === "entities") {
        await loadEntities();
      } else if (tab === "users") {
        await loadUsers();
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVideos() {
    const result = await window.storage.list("video:");
    const vids = [];
    if (result && result.keys) {
      for (const key of result.keys) {
        const vidResult = await window.storage.get(key);
        if (vidResult) vids.push(JSON.parse(vidResult.value));
      }
    }
    vids.sort((a, b) => b.timestamp - a.timestamp);
    setVideos(vids);
  }

  async function loadEntities() {
    const result = await window.storage.list("entity:");
    const ents = [];
    if (result && result.keys) {
      for (const key of result.keys) {
        const entResult = await window.storage.get(key);
        if (entResult) {
          const entity = JSON.parse(entResult.value);
          // Entity admins only see their own entities
          if (isEntityAdmin) {
            if (entity.adminEmail === currentUser.email) {
              ents.push(entity);
            }
          } else {
            // Master admin sees all
            ents.push(entity);
          }
        }
      }
    }
    ents.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    setEntities(ents);
  }

  async function loadUsers() {
    // Extract unique users from videos
    const uniqueUsers = new Set();

    const videoResult = await window.storage.list("video:");
    if (videoResult && videoResult.keys) {
      for (const key of videoResult.keys) {
        const vidResult = await window.storage.get(key);
        if (vidResult) {
          const vid = JSON.parse(vidResult.value);
          if (vid.uploadedBy) uniqueUsers.add(vid.uploadedBy);
        }
      }
    }

    setUsers(Array.from(uniqueUsers).map((email) => ({ email })));
  }

  async function handleApproveVideo(videoId) {
    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    video.status = "approved";
    await window.storage.set(`video:${videoId}`, JSON.stringify(video));
    setVideos((prev) => prev.map((v) => (v.id === videoId ? video : v)));
  }

  async function handleRejectVideo(videoId) {
    const video = videos.find((v) => v.id === videoId);
    if (!video) return;

    video.status = "rejected";
    await window.storage.set(`video:${videoId}`, JSON.stringify(video));
    setVideos((prev) => prev.map((v) => (v.id === videoId ? video : v)));
  }

  async function handleDeleteVideo(videoId) {
    if (!confirm("Delete this video permanently?")) return;
    await window.storage.delete(`video:${videoId}`);
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
  }

  async function handleSaveEntity(entityData) {
    const entity = {
      ...editingEntity,
      ...entityData,
      updatedAt: Date.now(),
    };

    await window.storage.set(
      `entity:${entity.country}:${entity.id}`,
      JSON.stringify(entity)
    );
    setEntities((prev) => prev.map((e) => (e.id === entity.id ? entity : e)));
    setEditingEntity(null);
  }

  async function handleVerifyEntity(entity) {
    entity.verified = true;
    entity.verifiedAt = Date.now();
    entity.verifiedBy = currentUser.email;

    await window.storage.set(
      `entity:${entity.country}:${entity.id}`,
      JSON.stringify(entity)
    );
    setEntities((prev) => prev.map((e) => (e.id === entity.id ? entity : e)));
    setShowVerifyModal(null);
  }

  async function handleDeleteEntity(entityId) {
    const entity = entities.find((e) => e.id === entityId);
    if (!entity) return;
    if (!confirm(`Delete ${entity.name} permanently?`)) return;

    await window.storage.delete(`entity:${entity.country}:${entityId}`);
    setEntities((prev) => prev.filter((e) => e.id !== entityId));
  }

  if (!currentUser || !currentUser.email.includes("admin")) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              {isMasterAdmin ? "Master Admin" : "Entity Admin"} -{" "}
              {currentUser.email}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {(isMasterAdmin
            ? ["videos", "entities", "users", "data"]
            : ["entities"]
          ).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-medium capitalize transition ${
                tab === t
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}

        {/* Videos Tab (Master Admin Only) */}
        {!loading && tab === "videos" && isMasterAdmin && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">{videos.length} total videos</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {videos.filter((v) => v.status === "pending").length} pending
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {videos.filter((v) => v.status === "approved").length}{" "}
                  approved
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{video.caption}</p>
                          <p className="text-sm text-gray-600">
                            By: {video.uploadedByName || video.uploadedBy} •{" "}
                            {video.country}
                          </p>
                          {video.entityName && (
                            <p className="text-sm text-gray-600">
                              📍 {video.entityName}
                              {video.needsEntityReview && (
                                <span className="ml-2 text-orange-600">
                                  (New - needs review)
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            video.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : video.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {video.status || "pending"}
                        </span>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {video.status !== "approved" && (
                          <button
                            onClick={() => handleApproveVideo(video.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                          >
                            Approve
                          </button>
                        )}
                        {video.status !== "rejected" && (
                          <button
                            onClick={() => handleRejectVideo(video.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteVideo(video.id)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Entities Tab */}
        {!loading && tab === "entities" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                {entities.length} {isEntityAdmin ? "your" : "total"} entities
              </p>
              {isMasterAdmin && (
                <button className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition">
                  Import CSV
                </button>
              )}
            </div>

            <div className="space-y-3">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Entity Image */}
                    <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {entity.imageUrl ? (
                        <img
                          src={entity.imageUrl}
                          alt={entity.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Wine className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-lg">{entity.name}</p>
                        {entity.verified && (
                          <span className="px-2 py-1 bg-black text-white rounded text-xs font-medium flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            W1NE Verified
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {entity.address}
                      </p>

                      {entity.about && (
                        <p className="text-sm text-gray-700 mb-3">
                          {entity.about}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {entity.country}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">
                          {entity.type}
                        </span>
                        {entity.specialties?.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-gray-100 rounded text-xs"
                          >
                            #{spec}
                          </span>
                        ))}
                        {entity.addedBy === "claude-ai" && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            AI Added
                          </span>
                        )}
                      </div>

                      {entity.contact && (
                        <div className="text-xs text-gray-600 space-y-1">
                          {entity.contact.phone && (
                            <p>📞 {entity.contact.phone}</p>
                          )}
                          {entity.contact.email && (
                            <p>✉️ {entity.contact.email}</p>
                          )}
                          {entity.contact.website && (
                            <p>🌐 {entity.contact.website}</p>
                          )}
                        </div>
                      )}

                      {entity.adminEmail && (
                        <p className="text-xs text-gray-600 mt-2">
                          👤 Admin: {entity.adminEmail}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setEditingEntity(entity)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Edit
                      </button>

                      {!entity.verified && isMasterAdmin && (
                        <button
                          onClick={() => setShowVerifyModal(entity)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
                        >
                          Verify
                        </button>
                      )}

                      {isMasterAdmin && (
                        <button
                          onClick={() => handleDeleteEntity(entity.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {!loading && tab === "users" && (
          <div>
            <p className="text-gray-600 mb-4">
              {users.length} registered users
            </p>
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.email}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <p className="font-medium">{user.email}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Management Tab */}
        {!loading && tab === "data" && (
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Import Data</h3>
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-left">
                  📁 Import Entities from CSV
                </button>
                <button className="w-full px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition text-left">
                  📊 Export All Data
                </button>
                <button className="w-full px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-left">
                  🗑️ Clear All Cache
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4">Statistics</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{videos.length}</p>
                  <p className="text-sm text-gray-600">Videos</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{entities.length}</p>
                  <p className="text-sm text-gray-600">Entities</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Users</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Entity Edit Modal */}
      {editingEntity && (
        <EntityEditModal
          entity={editingEntity}
          onClose={() => setEditingEntity(null)}
          onSave={handleSaveEntity}
          isMasterAdmin={isMasterAdmin}
        />
      )}

      {/* Verify Confirmation Modal */}
      {showVerifyModal && (
        <VerifyConfirmModal
          entity={showVerifyModal}
          onClose={() => setShowVerifyModal(null)}
          onConfirm={() => handleVerifyEntity(showVerifyModal)}
        />
      )}
    </div>
  );
}

function EntityEditModal({ entity, onClose, onSave, isMasterAdmin }) {
  const [name, setName] = useState(entity.name || "");
  const [address, setAddress] = useState(entity.address || "");
  const [type, setType] = useState(entity.type || "wine-bar");
  const [about, setAbout] = useState(entity.about || "");
  const [imageUrl, setImageUrl] = useState(entity.imageUrl || "");
  const [phone, setPhone] = useState(entity.contact?.phone || "");
  const [email, setEmail] = useState(entity.contact?.email || "");
  const [website, setWebsite] = useState(entity.contact?.website || "");
  const [specialties, setSpecialties] = useState(
    (entity.specialties || []).join(", ")
  );
  const [adminEmail, setAdminEmail] = useState(entity.adminEmail || "");

  function handleSubmit() {
    onSave({
      name,
      address,
      type,
      about,
      imageUrl: imageUrl || null,
      contact: {
        phone: phone || null,
        email: email || null,
        website: website || null,
      },
      specialties: specialties
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      adminEmail: adminEmail || null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Edit Entity</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address *</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            >
              <option value="wine-bar">Wine Bar</option>
              <option value="retailer">Retailer</option>
              <option value="restaurant">Restaurant</option>
              <option value="winery">Winery</option>
              <option value="experience">Experience</option>
              <option value="bottle">Bottle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">About</label>
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            />
            {imageUrl && (
              <div className="mt-2 w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Specialties (comma separated)
            </label>
            <input
              type="text"
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="natural, organic, biodynamic"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-3">Contact Information</h3>

            <div className="space-y-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />

              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="Website"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>
          </div>

          {isMasterAdmin && (
            <div className="border-t border-gray-200 pt-4">
              <label className="block text-sm font-medium mb-2">
                Entity Admin Email
                <span className="text-gray-500 font-normal ml-2">
                  (User who can manage this entity)
                </span>
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@estate.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />
              <p className="text-xs text-gray-500 mt-1">
                This user will be able to log in and edit this entity
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            className="w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function VerifyConfirmModal({ entity, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Verify Entity</h2>
          <p className="text-gray-600">
            Are you sure you want to verify{" "}
            <span className="font-semibold">{entity.name}</span>?
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 mb-2">
            <strong>This entity will receive:</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• W1NE Verified badge</li>
            <li>• Higher ranking in search results</li>
            <li>• Trust indicator for users</li>
            <li>• Enhanced profile display</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Verify Now
          </button>
        </div>
      </div>
    </div>
  );
}

function BookmarksView({ currentUser, onRequireAuth }) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    loadBookmarks();
  }, [currentUser]);

  async function loadBookmarks() {
    if (!currentUser) return;

    setLoading(true);
    try {
      const result = await window.storage.list(
        `bookmark:${currentUser.email}:`
      );
      const loadedBookmarks = [];

      if (result && result.keys) {
        for (const key of result.keys) {
          const bookmarkResult = await window.storage.get(key);
          if (bookmarkResult) {
            loadedBookmarks.push(JSON.parse(bookmarkResult.value));
          }
        }
      }

      // Sort by newest first
      loadedBookmarks.sort((a, b) => b.timestamp - a.timestamp);
      setBookmarks(loadedBookmarks);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveBookmark(bookmark) {
    if (!confirm("Remove this bookmark?")) return;

    try {
      await window.storage.delete(
        `bookmark:${currentUser.email}:${bookmark.entityId}`
      );
      setBookmarks(bookmarks.filter((b) => b.entityId !== bookmark.entityId));
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Bookmarks</h1>
          <p className="text-gray-600">
            {bookmarks.length} saved{" "}
            {bookmarks.length === 1 ? "place" : "places"}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No bookmarks yet</p>
            <p className="text-sm text-gray-500">
              Start exploring and save your favorite wine places!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.entityId}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black transition"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg flex-1">
                      {bookmark.entity.name}
                    </h3>
                    {bookmark.entity.verified && (
                      <Star className="w-4 h-4 fill-black text-black flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {bookmark.entity.address}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {bookmark.entity.specialties?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedEntity(bookmark.entity)}
                      className="flex-1 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Entity Detail Modal */}
      {selectedEntity && (
        <EntityDetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onBookmark={() => {}}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

const WORKER_URL = 'w1ne-ai-claude.shawn-815.workers.dev';

function ClaudeChatInterface({ selectedRegion, currentUser, onRequireAuth }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hey! What's on your mind today? Looking for a wine bar, a specific bottle, or just exploring? 🍷",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Seed initial data and load conversation history on mount
  useEffect(() => {
    seedInitialData();
    loadConversationHistory();
  }, [selectedRegion]);

  async function loadConversationHistory() {
    try {
      const result = await window.storage.list("conversation:");
      const convos = [];

      if (result && result.keys) {
        for (const key of result.keys) {
          const convoResult = await window.storage.get(key);
          if (convoResult) {
            const convo = JSON.parse(convoResult.value);
            if (convo.region === selectedRegion) {
              convos.push(convo);
            }
          }
        }
      }

      // Sort by most recent
      convos.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
      setConversationHistory(convos);
    } catch (error) {
      console.error("Error loading conversation history:", error);
    }
  }

  async function saveConversation() {
    if (messages.length <= 1) return; // Don't save if only welcome message

    const convoId = currentConversationId || `conversation_${Date.now()}`;
    const convo = {
      id: convoId,
      region: selectedRegion,
      messages: messages,
      lastMessageAt: Date.now(),
      preview: messages[1]?.content?.slice(0, 60) || "New conversation",
    };

    try {
      await window.storage.set(
        `conversation:${convoId}`,
        JSON.stringify(convo)
      );
      setCurrentConversationId(convoId);
      loadConversationHistory();
    } catch (error) {
      console.error("Error saving conversation:", error);
    }
  }

  function loadConversation(convo) {
    setMessages(convo.messages);
    setMatchResults([]);
    setCurrentConversationId(convo.id);
  }

  function startNewChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Hey! What's on your mind today? Looking for a wine bar, a specific bottle, or just exploring? 🍷",
        timestamp: Date.now(),
      },
    ]);
    setMatchResults([]);
    setCurrentConversationId(null);
  }

  async function seedInitialData() {
    // Check if we already have data for this region
    const existing = await window.storage.list(`entity:${selectedRegion}:`);
    if (existing && existing.keys && existing.keys.length > 0) {
      console.log("Data already exists for", selectedRegion);
      return;
    }

    // Seed data based on region
    const sampleData = {
      CH: [
        {
          id: "entity_ch_zurich_001",
          name: "Weinhandel Zürich",
          slug: "weinhandel-zurich",
          type: "retailer",
          address: "Bahnhofstrasse 1, 8001 Zürich",
          lat: 47.3769,
          lng: 8.5417,
          country: "CH",
          about:
            "Family-owned wine shop specializing in Swiss and organic wines since 1952.",
          specialties: ["swiss-wine", "organic", "natural"],
          contact: {
            phone: "+41 44 123 4567",
            email: "info@weinhandel.ch",
          },
          isPaid: true,
          verified: true,
        },
        {
          id: "entity_ch_geneva_001",
          name: "Cave de Genève",
          slug: "cave-de-geneve",
          type: "wine-bar",
          address: "Rue du Rhône 42, 1204 Genève",
          lat: 46.2044,
          lng: 6.1432,
          country: "CH",
          about:
            "Cozy wine bar featuring natural wines and small producer discoveries.",
          specialties: ["natural", "wine-bar", "tastings"],
          contact: {
            phone: "+41 22 987 6543",
            email: "hello@cavegeneve.ch",
          },
          isPaid: false,
          verified: true,
        },
        {
          id: "entity_ch_zurich_002",
          name: "Vinorama Zurich",
          slug: "vinorama-zurich",
          type: "wine-bar",
          address: "Niederdorfstrasse 15, 8001 Zürich",
          lat: 47.3737,
          lng: 8.5445,
          country: "CH",
          about:
            "Modern wine bar in the heart of old town Zurich, serving natural wines and small plates.",
          specialties: ["natural", "wine-bar", "organic", "small-plates"],
          contact: {
            phone: "+41 44 555 7890",
            email: "info@vinorama.ch",
          },
          isPaid: true,
          verified: true,
        },
      ],
      US: [
        {
          id: "entity_us_sf_001",
          name: "Ferry Plaza Wine Merchant",
          slug: "ferry-plaza-wine",
          type: "retailer",
          address: "One Ferry Building, San Francisco, CA 94111",
          country: "US",
          about:
            "Premier wine shop at Ferry Building with curated selection of California and international wines.",
          specialties: ["california", "premium", "tastings"],
          contact: {
            phone: "+1 415 391 9400",
          },
          isPaid: false,
          verified: true,
        },
      ],
      FR: [
        {
          id: "entity_fr_paris_001",
          name: "La Cave des Papilles",
          slug: "cave-des-papilles",
          type: "wine-bar",
          address: "22 Rue de la Verrerie, 75004 Paris",
          country: "FR",
          about:
            "Natural wine bar in the Marais with rotating selection of small producers.",
          specialties: ["natural", "wine-bar", "organic"],
          contact: {
            phone: "+33 1 42 77 76 15",
          },
          isPaid: false,
          verified: true,
        },
      ],
    };

    const dataForRegion = sampleData[selectedRegion] || [];

    for (const entity of dataForRegion) {
      try {
        await window.storage.set(
          `entity:${selectedRegion}:${entity.id}`,
          JSON.stringify(entity)
        );
        console.log("Seeded:", entity.name);
      } catch (err) {
        console.error("Failed to seed:", entity.name, err);
      }
    }
  }

  async function handleSendMessage() {
  if (!input.trim() || isLoading) return;
  
  const userMessage = input.trim();
  setInput('');
  
  // Add user message to chat
  const newMessages = [...messages, { role: 'user', content: userMessage }];
  setMessages(newMessages);
  setIsLoading(true);
  
  try {
    // Call your Cloudflare Worker
    const response = await fetch(WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: userMessage,
        history: newMessages.slice(-10) // Last 10 messages for context
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const aiMessage = data.message;

    // Add AI response to chat
    setMessages([...newMessages, {
      role: 'assistant',
      content: aiMessage
    }]);

  } catch (error) {
    console.error('Chat error:', error);
    setMessages([...newMessages, {
      role: 'assistant',
      content: 'Sorry, I\'m having trouble connecting. Please try again!'
    }]);
  } finally {
    setIsLoading(false);
  }
}

  async function searchLocalEntities(query, region) {
    // Load entities from storage
    try {
      const result = await window.storage.list(`entity:${region}:`);
      const entities = [];

      if (result && result.keys) {
        for (const key of result.keys) {
          const entityResult = await window.storage.get(key);
          if (entityResult) {
            entities.push(JSON.parse(entityResult.value));
          }
        }
      }

      // Simple matching logic
      const queryLower = query.toLowerCase();
      return entities.filter(
        (e) =>
          e.name?.toLowerCase().includes(queryLower) ||
          e.address?.toLowerCase().includes(queryLower) ||
          e.type?.toLowerCase().includes(queryLower) ||
          e.specialties?.some((s) => s.toLowerCase().includes(queryLower)) ||
          e.about?.toLowerCase().includes(queryLower)
      );
    } catch (error) {
      console.error("Local search error:", error);
      return [];
    }
  }

  async function searchWithClaudeAndAdd(query, region) {
    try {
      // Call Claude API with web search tool
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: `IMPORTANT: The user is in ${region}. Find wine bars, wine shops, or wine-related places in ${region} matching this query: "${query}". 
            
ONLY return results for ${region} unless the user explicitly mentions another location.

For EACH place you find, you MUST extract:
1. Business name
2. Full address (including city and ${region})
3. Type (wine-bar, retailer, restaurant, winery)
4. Description
5. Specialties/features
6. Contact info (phone, email)
7. **WEBSITE URL** (the main website homepage - CRITICAL)
8. **IMAGE URLs** (find 1-3 high quality images of the place from the web)

Search the web thoroughly and extract the website URL and image URLs from search results.

Return ONLY a JSON array (no markdown, no explanation). Each place MUST have this exact structure:

[{
  "name": "Business Name",
  "address": "Full address with city, ${region}",
  "type": "wine-bar",
  "about": "Description",
  "specialties": ["natural", "organic"],
  "contact": {
    "phone": "+XX XXX XXX XXXX",
    "email": "email@domain.com",
    "website": "https://example.com"
  },
  "websiteUrl": "https://example.com",
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ]
}]

CRITICAL: 
- websiteUrl is the main homepage URL
- imageUrls should be direct links to actual images (jpg, png, webp)
- Extract these from web search results
- If you can't find website or images, use null

If you find nothing in ${region}, return an empty array [].`,
            },
          ],
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("Claude response:", data);

      // Extract text from response
      let responseText = "";
      if (data.content) {
        for (const item of data.content) {
          if (item.type === "text") {
            responseText += item.text;
          }
        }
      }

      // Parse JSON from response
      let places = [];
      try {
        // Remove markdown code blocks if present
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          places = JSON.parse(jsonMatch[0]);
        } else {
          places = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error("Failed to parse Claude response:", responseText);
        return [];
      }

      // Add each place to our database with web-sourced media
      const addedEntities = [];
      for (const place of places) {
        // Try to download and convert first image to base64 if available
        // Note: May fail due to CORS, that's okay - we keep the URL
        let imageData = null;
        if (place.imageUrls && place.imageUrls.length > 0) {
          try {
            // Simple approach: store URL for now, actual download can be done server-side
            // For MVP, we'll just use the imageUrls directly
            imageData = null; // Skip base64 conversion to avoid CORS issues
          } catch (imgError) {
            console.log("Could not fetch image:", imgError);
          }
        }

        const entity = {
          id: `entity_${region}_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          name: place.name,
          slug: place.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          type: place.type || "retailer",
          address: place.address,
          lat: null, // Could geocode later
          lng: null,
          country: region,
          about: place.about || "",
          specialties: place.specialties || [],
          contact: place.contact || {},
          websiteUrl: place.websiteUrl || place.contact?.website || null,
          imageUrls: place.imageUrls || [],
          imageData: imageData, // Will be null for now due to CORS
          imageUrl:
            place.imageUrls && place.imageUrls[0] ? place.imageUrls[0] : null, // Use first URL directly
          isPaid: false,
          verified: false,
          addedBy: "claude-ai",
          addedAt: Date.now(),
          webSourced: true, // Flag to indicate this came from web search
        };

        // Save to storage
        await window.storage.set(
          `entity:${region}:${entity.id}`,
          JSON.stringify(entity)
        );

        addedEntities.push(entity);
      }

      return addedEntities;
    } catch (error) {
      console.error("Claude API error:", error);
      return [];
    }
  }

  async function handleBookmark(entity, type) {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    try {
      const bookmark = {
        entityId: entity.id,
        type: type, // 'visit' or 'wine'
        entity: entity,
        timestamp: Date.now(),
      };

      // Save to user bookmarks
      const bookmarkKey = `bookmark:${currentUser.email}:${entity.id}`;
      await window.storage.set(bookmarkKey, JSON.stringify(bookmark));

      // Close the modal
      setSelectedEntity(null);

      // Show success message in chat
      const successMessage = {
        role: "assistant",
        content: `✓ Saved "${entity.name}" to your bookmarks! You can view all your saved places in your profile.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Bookmark error:", error);
      alert("Failed to save bookmark. Please try again.");
    }
  }

  return (
    <div className="pt-20 h-screen flex max-w-7xl mx-auto">
      {/* Conversation History Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={startNewChat}
            className="w-full px-4 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Recent Conversations
          </h3>

          {conversationHistory.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-2">
              {conversationHistory.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => loadConversation(convo)}
                  className={`w-full text-left p-3 rounded-lg transition border ${
                    currentConversationId === convo.id
                      ? "bg-white border-black"
                      : "bg-white hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <p className="text-sm font-medium mb-1 line-clamp-2">
                    {convo.preview}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(convo.lastMessageAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-message ${
                msg.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-black text-white rounded-3xl rounded-tr-sm px-6 py-4"
                    : "bg-gray-100 text-black rounded-3xl rounded-tl-sm px-6 py-4"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        {/* Add loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                </div>
              )}

          {/* Match Results */}
          {matchResults.length > 0 && (
            <div className="space-y-3">
              {matchResults.map((entity) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  onClick={() => setSelectedEntity(entity)}
                />
              ))}
            </div>
          )}

          {loading && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 rounded-3xl rounded-tl-sm px-6 py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
<div className="border-t border-gray-200 bg-white p-6">
  <div className="flex gap-3">
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      placeholder="What are you looking for?"
      className="flex-1 px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-black transition text-sm"
    />
    <button
      onClick={handleSendMessage}
      disabled={isLoading || !input.trim()}
      className="px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        'Sending...'
      ) : (
        <Send className="w-5 h-5" />
      )}
    </button>
  </div>
</div>

{/* Entity Detail Modal */}
      {selectedEntity && (
        <EntityDetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onBookmark={handleBookmark}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

function EntityCard({ entity, onClick }) {
  // Priority: imageData (base64) > imageUrl (admin) > imageUrls[0] (web) > placeholder
  const displayImage =
    entity.imageData || entity.imageUrl || entity.imageUrls?.[0];

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-5 bg-white border border-gray-200 rounded-2xl hover:border-black transition hover-lift"
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0 overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt={entity.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center text-gray-400"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Camera className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{entity.name}</h3>
            {entity.verified && (
              <Star className="w-4 h-4 fill-black text-black" />
            )}
            {entity.webSourced && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                Web
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {entity.address}
          </p>
          <div className="flex flex-wrap gap-2">
            {entity.specialties?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
      </div>
    </button>
  );
}

function EntityDetailModal({ entity, onClose, onBookmark, currentUser }) {
  const [showWebsite, setShowWebsite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const hasWebsite = entity.websiteUrl || entity.contact?.website;
  const websiteUrl = entity.websiteUrl || entity.contact?.website;
  const displayImage =
    !imageError &&
    (entity.imageData || entity.imageUrl || entity.imageUrls?.[0]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 md:items-center">
      <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{entity.name}</h2>
            {entity.verified && (
              <span className="px-2 py-1 bg-black text-white rounded text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                W1NE
              </span>
            )}
            {entity.webSourced && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                Web Sourced
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Tab Navigation */}
          {hasWebsite && (
            <div className="flex gap-2 border-b border-gray-200">
              <button
                onClick={() => setShowWebsite(false)}
                className={`px-4 py-2 font-medium transition ${
                  !showWebsite
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setShowWebsite(true)}
                className={`px-4 py-2 font-medium transition ${
                  showWebsite
                    ? "border-b-2 border-black text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Website Preview
              </button>
            </div>
          )}

          {/* Website Iframe View */}
          {showWebsite && hasWebsite ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                <span className="text-sm text-gray-600 truncate flex-1">
                  🌐 {websiteUrl}
                </span>
                <a
                  href={websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition flex items-center gap-2"
                >
                  Visit Site
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>

              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden border-2 border-gray-200">
                <iframe
                  src={websiteUrl}
                  className="w-full h-full"
                  title={`${entity.name} website`}
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                  loading="lazy"
                />
              </div>

              <p className="text-xs text-gray-500 text-center">
                Preview of {entity.name}'s website. Click "Visit Site" to open
                in new tab.
              </p>
            </div>
          ) : (
            <>
              {/* Details View */}
              {/* Image Gallery */}
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={entity.name}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {entity.imageUrls && entity.imageUrls.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {entity.imageUrls.slice(1, 4).map((imgUrl, idx) => (
                    <div
                      key={idx}
                      className="aspect-video bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <img
                        src={imgUrl}
                        alt={`${entity.name} ${idx + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Info */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  {entity.verified && (
                    <span className="px-3 py-1 bg-black text-white rounded-full text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      W1NE Verified
                    </span>
                  )}
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium uppercase">
                    {entity.type.replace("-", " ")}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                    {entity.country}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {entity.address}
                </p>

                {entity.about && (
                  <p className="text-gray-800 leading-relaxed mb-6">
                    {entity.about}
                  </p>
                )}

                {entity.specialties && entity.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {entity.specialties.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => onBookmark(entity, "visit")}
                  className="w-full px-6 py-4 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" />I Want to Go Here
                </button>

                {hasWebsite && (
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-4 bg-gray-100 rounded-2xl font-medium text-center hover:bg-gray-200 transition"
                  >
                    🌐 Visit Website
                  </a>
                )}

                {entity.contact?.phone && (
                  <a
                    href={`tel:${entity.contact.phone}`}
                    className="block w-full px-6 py-4 bg-gray-100 rounded-2xl font-medium text-center hover:bg-gray-200 transition"
                  >
                    📞 {entity.contact.phone}
                  </a>
                )}

                {entity.contact?.email && (
                  <a
                    href={`mailto:${entity.contact.email}`}
                    className="block w-full px-6 py-4 bg-gray-100 rounded-2xl font-medium text-center hover:bg-gray-200 transition"
                  >
                    ✉️ Send Email
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AgeGateWithRegion({ onVerified, onShowAuth }) {
  const [step, setStep] = useState(1); // 1: age, 2: region
  const [selectedRegion, setSelectedRegion] = useState('');
  
  function handleAgeVerified() {
    setStep(2);
  }
  
  function handleRegionSelected() {
    if (!selectedRegion) {
      alert('Please select your region');
      return;
    }
    onVerified(selectedRegion);
  }
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header matching app style */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Wine className="w-8 h-8 text-black" />
            <h1 className="text-2xl font-bold text-black">W1NE</h1>
          </div>
        </div>
      </header>

      {/* Main content centered */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          {step === 1 ? (
            // Age Verification Step
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to W1NE</h2>
              <p className="text-gray-600 mb-8">Please verify your age or sign in to continue.</p>
              
              <div className="space-y-3">
                <button
                  onClick={handleAgeVerified}
                  className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  I am 18+
                </button>
                
                <button
                  onClick={onShowAuth}
                  className="w-full px-6 py-4 bg-white text-black border-2 border-gray-200 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  Sign In
                </button>
              </div>
            </div>
          ) : (
            // Region Selection Step
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back
              </button>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Your Region</h2>
              <p className="text-gray-600 mb-6">Choose your location to get started.</p>
              
              <div className="space-y-4">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full px-4 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-xl text-base focus:border-black focus:outline-none hover:border-gray-300 transition"
                >
                  <option value="">Select Your Region</option>
                  <option value="CH">🇨🇭 Switzerland</option>
                  <option value="US">🇺🇸 United States</option>
                  <option value="FR">🇫🇷 France</option>
                  <option value="IT">🇮🇹 Italy</option>
                  <option value="ES">🇪🇸 Spain</option>
                  <option value="DE">🇩🇪 Germany</option>
                  <option value="AT">🇦🇹 Austria</option>
                  <option value="UK">🇬🇧 United Kingdom</option>
                  <option value="AU">🇦🇺 Australia</option>
                  <option value="NZ">🇳🇿 New Zealand</option>
                  <option value="ZA">🇿🇦 South Africa</option>
                  <option value="AR">🇦🇷 Argentina</option>
                  <option value="CL">🇨🇱 Chile</option>
                </select>
                
                <button
                  onClick={handleRegionSelected}
                  className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer matching app style */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <a href="#about" className="hover:text-black transition">About Us</a>
            <span className="text-gray-300">•</span>
            <a href="#impressum" className="hover:text-black transition">Impressum</a>
            <span className="text-gray-300">•</span>
            <a href="#privacy" className="hover:text-black transition">Privacy Policy</a>
            <span className="text-gray-300">•</span>
            <a href="#cookies" className="hover:text-black transition">Cookie Policy</a>
            <span className="text-gray-300">•</span>
            <a href="#terms" className="hover:text-black transition">Terms of Use</a>
          </div>
          <div className="text-center mt-4 text-xs text-gray-400">
            © 2026 W1NE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function AuthModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email"); // 'email' or 'code'
  const [loading, setLoading] = useState(false);

  async function handleSendCode() {
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email");
      return;
    }

    setLoading(true);

    // Simulate sending code
    setTimeout(() => {
      const mockCode = "123456";
      localStorage.setItem("w1ne_mock_code", mockCode);
      alert(`Mock code sent: ${mockCode}`);
      setStep("code");
      setLoading(false);
    }, 1000);
  }

  async function handleVerifyCode() {
    const mockCode = localStorage.getItem("w1ne_mock_code");

    if (code === mockCode) {
      const user = {
        email: email,
        verified: true,
        createdAt: Date.now(),
      };

      localStorage.setItem("w1ne_user", JSON.stringify(user));
      onSuccess(user);
    } else {
      alert("Invalid code. Try: 123456");
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {step === "email" ? "Sign In" : "Enter Code"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "email" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendCode()}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <button
              onClick={handleSendCode}
              disabled={loading}
              className="w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-300"
            >
              {loading ? "Sending..." : "Send Magic Link"}
            </button>

            <p className="text-xs text-gray-500 text-center">
              We'll email you a code to sign in. No passwords needed!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Enter the 6-digit code we sent to <strong>{email}</strong>
            </p>

            <div>
              <label className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleVerifyCode()}
                placeholder="123456"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition text-center text-2xl tracking-widest font-mono"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              className="w-full px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Verify & Sign In
            </button>

            <button
              onClick={() => setStep("email")}
              className="w-full text-sm text-gray-600 hover:text-black transition"
            >
              Use a different email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DiscoverView({ selectedRegion, currentUser, onRequireAuth }) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'wine-bar', 'retailer', 'restaurant'
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState(selectedRegion || "all");

  const countries = [
    { code: "all", name: "All Countries" },
    { code: "CH", name: "Switzerland" },
    { code: "US", name: "United States" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "ZA", name: "South Africa" },
  ];

  useEffect(() => {
    loadAllEntities();
  }, [countryFilter]);

  async function loadAllEntities() {
    setLoading(true);
    try {
      let loadedEntities = [];

      if (countryFilter === "all") {
        // Load from all countries
        for (const country of countries) {
          if (country.code === "all") continue;
          const result = await window.storage.list(`entity:${country.code}:`);
          if (result && result.keys) {
            for (const key of result.keys) {
              const entityResult = await window.storage.get(key);
              if (entityResult) {
                loadedEntities.push(JSON.parse(entityResult.value));
              }
            }
          }
        }
      } else {
        // Load from selected country
        const result = await window.storage.list(`entity:${countryFilter}:`);
        if (result && result.keys) {
          for (const key of result.keys) {
            const entityResult = await window.storage.get(key);
            if (entityResult) {
              loadedEntities.push(JSON.parse(entityResult.value));
            }
          }
        }
      }

      setEntities(loadedEntities);
    } catch (error) {
      console.error("Error loading entities:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookmark(entity) {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    try {
      const bookmark = {
        entityId: entity.id,
        type: "visit",
        entity: entity,
        timestamp: Date.now(),
      };

      await window.storage.set(
        `bookmark:${currentUser.email}:${entity.id}`,
        JSON.stringify(bookmark)
      );

      alert("✓ Saved to bookmarks!");
    } catch (error) {
      console.error("Bookmark error:", error);
    }
  }

  const filteredEntities = entities.filter((e) => {
    // Type filter
    if (filter !== "all" && e.type !== filter) return false;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        e.name?.toLowerCase().includes(query) ||
        e.address?.toLowerCase().includes(query) ||
        e.about?.toLowerCase().includes(query) ||
        e.specialties?.some((s) => s.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    return true;
  });

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Discover</h1>
          <p className="text-gray-600">
            {filteredEntities.length} wine businesses
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or specialty..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-black transition"
            />
          </div>
        </div>

        {/* Country Filter */}
        <div className="mb-6">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("wine-bar")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === "wine-bar"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Wine Bars
          </button>
          <button
            onClick={() => setFilter("retailer")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === "retailer"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Retailers
          </button>
          <button
            onClick={() => setFilter("restaurant")}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === "restaurant"
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Restaurants
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntities.map((entity) => (
              <button
                key={entity.id}
                onClick={() => setSelectedEntity(entity)}
                className="text-left bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-black transition hover-lift"
              >
                {/* Image */}
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <Camera className="w-12 h-12 text-gray-400" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{entity.name}</h3>
                    {entity.verified && (
                      <Star className="w-4 h-4 fill-black text-black" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {entity.address}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {entity.specialties?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-lg text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-black text-white rounded-lg text-xs uppercase">
                      {entity.type}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filteredEntities.length === 0 && (
          <div className="text-center py-20">
            <Wine className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              No {filter === "all" ? "businesses" : filter.replace("-", " ")}{" "}
              found
            </p>
          </div>
        )}
      </div>

      {/* Entity Detail Modal */}
      {selectedEntity && (
        <EntityDetailModal
          entity={selectedEntity}
          onClose={() => setSelectedEntity(null)}
          onBookmark={handleBookmark}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

function WinetubeView({ selectedRegion, currentUser, onRequireAuth }) {
  const [videos, setVideos] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);

  useEffect(() => {
    loadVideos();
  }, [selectedRegion]);

  async function loadVideos() {
    setLoading(true);
    try {
      const result = await window.storage.list("video:");
      const loadedVideos = [];

      if (result && result.keys) {
        for (const key of result.keys) {
          const videoResult = await window.storage.get(key);
          if (videoResult) {
            const video = JSON.parse(videoResult.value);
            // Show all videos, not filtered by region anymore
            loadedVideos.push(video);
          }
        }
      }

      // Sort by newest first
      loadedVideos.sort((a, b) => b.timestamp - a.timestamp);
      setVideos(loadedVideos);
    } catch (error) {
      console.error("Error loading videos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUploadVideo(videoData) {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    const video = {
      id:
        editingVideo?.id ||
        `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...videoData,
      uploadedBy: currentUser.email,
      uploadedByName: currentUser.email.split("@")[0],
      timestamp: editingVideo?.timestamp || Date.now(),
      updatedAt: Date.now(),
      likes: editingVideo?.likes || 0,
      status: "pending", // pending, approved, rejected
    };

    await window.storage.set(`video:${video.id}`, JSON.stringify(video));

    if (editingVideo) {
      setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
    } else {
      setVideos((prev) => [video, ...prev]);
    }

    setShowUpload(false);
    setEditingVideo(null);
  }

  async function handleDeleteVideo(videoId) {
    if (!confirm("Delete this video?")) return;

    try {
      await window.storage.delete(`video:${videoId}`);
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  }

  function handleEditVideo(video) {
    setEditingVideo(video);
    setShowUpload(true);
  }

  return (
    <div className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Winetube</h1>
            <p className="text-gray-600">Share your wine experiences</p>
          </div>

          <button
            onClick={() => {
              setEditingVideo(null);
              currentUser ? setShowUpload(true) : onRequireAuth();
            }}
            className="px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Upload
          </button>
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                currentUser={currentUser}
                onEdit={() => handleEditVideo(video)}
                onDelete={() => handleDeleteVideo(video.id)}
              />
            ))}
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              No videos yet. Be the first to share!
            </p>
            <button
              onClick={() =>
                currentUser ? setShowUpload(true) : onRequireAuth()
              }
              className="px-6 py-3 bg-black text-white rounded-2xl font-semibold hover:bg-gray-800 transition"
            >
              Upload First Video
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => {
            setShowUpload(false);
            setEditingVideo(null);
          }}
          onUpload={handleUploadVideo}
          editingVideo={editingVideo}
          selectedRegion={selectedRegion}
        />
      )}
    </div>
  );
}

function VideoCard({ video, currentUser, onEdit, onDelete }) {
  const isOwner = currentUser && video.uploadedBy === currentUser.email;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div
        onClick={() => setShowDetails(true)}
        className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:border-black transition hover-lift"
      >
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-200 overflow-hidden">
          {video.thumbnailData ? (
            <img
              src={video.thumbnailData}
              alt={video.caption}
              className="w-full h-full object-cover"
            />
          ) : video.videoData ? (
            <video
              src={video.videoData}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Status Badge */}
        {video.status && (
          <div className="absolute top-2 left-2">
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${
                video.status === "approved"
                  ? "bg-green-500 text-white"
                  : video.status === "rejected"
                  ? "bg-red-500 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {video.status}
            </span>
          </div>
        )}

        {/* Play Button Overlay */}
        {video.videoData && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition">
            <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-black ml-1" fill="black" />
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4">
          <p className="font-medium text-sm mb-2 line-clamp-2">
            {video.caption}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
            <span>
              @{video.uploadedByName || video.uploadedBy?.split("@")[0]}
            </span>
            <span>•</span>
            <span>{video.country}</span>
          </div>

          {/* Tagged Entities */}
          {video.taggedEntities && video.taggedEntities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {video.taggedEntities.slice(0, 2).map((entity) => (
                <span
                  key={entity.id}
                  className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                >
                  📍 {entity.name}
                </span>
              ))}
              {video.taggedEntities.length > 2 && (
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                  +{video.taggedEntities.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition">
              <Heart className="w-4 h-4" />
              <span>{video.likes || 0}</span>
            </button>

            {isOwner && (
              <div className="ml-auto flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                  title="Edit"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition"
                  title="Delete"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Detail Modal */}
      {showDetails && (
        <VideoDetailModal
          video={video}
          onClose={() => setShowDetails(false)}
          isOwner={isOwner}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

function VideoDetailModal({ video, onClose, isOwner, onEdit, onDelete }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">
              @{video.uploadedByName || video.uploadedBy?.split("@")[0]}
            </h2>
            {video.status === "approved" && (
              <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                Approved
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Video Player */}
          {video.videoData ? (
            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
              <video src={video.videoData} controls className="w-full h-full" />
            </div>
          ) : video.thumbnailData ? (
            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6">
              <img
                src={video.thumbnailData}
                alt={video.caption}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
              <Camera className="w-16 h-16 text-gray-400" />
            </div>
          )}

          {/* Caption */}
          <p className="text-lg mb-4">{video.caption}</p>

          {/* Meta Info */}
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <span>{video.country}</span>
            <span>•</span>
            <span>{new Date(video.timestamp).toLocaleDateString()}</span>
          </div>

          {/* Tagged Entities */}
          {video.taggedEntities && video.taggedEntities.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Tagged Places</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {video.taggedEntities.map((entity) => (
                  <div
                    key={entity.id}
                    className="p-3 border border-gray-200 rounded-xl hover:border-black transition"
                  >
                    <p className="font-medium text-sm">{entity.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {entity.type} • {entity.country}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 px-6 py-3 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition flex items-center justify-center gap-2">
              <Heart className="w-5 h-5" />
              {video.likes || 0} Likes
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onEdit();
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onDelete();
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ onClose, onUpload, editingVideo, selectedRegion }) {
  const [caption, setCaption] = useState(editingVideo?.caption || "");
  const [country, setCountry] = useState(
    editingVideo?.country || selectedRegion
  );
  const [taggedEntities, setTaggedEntities] = useState(
    editingVideo?.taggedEntities || []
  );
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(
    editingVideo?.videoData || null
  );
  const [imagePreview, setImagePreview] = useState(
    editingVideo?.thumbnailData || null
  );
  const [existingEntities, setExistingEntities] = useState([]);
  const [showEntitySearch, setShowEntitySearch] = useState(false);
  const [entitySearchQuery, setEntitySearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);

  const countries = [
    { code: "CH", name: "Switzerland" },
    { code: "US", name: "United States" },
    { code: "FR", name: "France" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "ZA", name: "South Africa" },
  ];

  useEffect(() => {
    loadAllEntities();
  }, []);

  async function loadAllEntities() {
    try {
      const result = await window.storage.list("entity:");
      const entities = [];

      if (result && result.keys) {
        for (const key of result.keys) {
          const entityResult = await window.storage.get(key);
          if (entityResult) {
            entities.push(JSON.parse(entityResult.value));
          }
        }
      }

      setExistingEntities(entities);
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  }

  function handleVideoFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      // 50MB limit
      alert("Video file too large. Maximum 50MB.");
      return;
    }

    setVideoFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setVideoPreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleImageFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("Image file too large. Maximum 5MB.");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  function handleTagEntity(entity) {
    if (taggedEntities.find((e) => e.id === entity.id)) {
      // Already tagged, remove it
      setTaggedEntities((prev) => prev.filter((e) => e.id !== entity.id));
    } else {
      // Add tag
      setTaggedEntities((prev) => [
        ...prev,
        {
          id: entity.id,
          name: entity.name,
          type: entity.type,
          country: entity.country,
        },
      ]);
    }
  }

  async function handleSubmit() {
    if (!caption || !country) {
      alert("Please fill in caption and select a country");
      return;
    }

    if (!editingVideo && !videoFile && !imageFile) {
      alert("Please upload at least an image or video");
      return;
    }

    setUploading(true);

    try {
      const uploadData = {
        caption,
        country,
        taggedEntities,
        videoData: videoPreview,
        thumbnailData: imagePreview,
      };

      await onUpload(uploadData);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  const filteredEntities = existingEntities.filter(
    (e) =>
      e.name.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      e.address.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      e.country.toLowerCase().includes(entitySearchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {editingVideo ? "Edit Upload" : "Upload to Winetube"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Media Upload */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Video File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-black transition">
                {videoPreview ? (
                  <div className="space-y-2">
                    <video
                      src={videoPreview}
                      className="w-full h-48 object-cover rounded-lg"
                      controls
                    />
                    <button
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove Video
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload video (max 50MB)
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm cursor-pointer hover:bg-gray-800 transition"
                    >
                      Choose Video
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Thumbnail Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-black transition">
                {imagePreview ? (
                  <div className="space-y-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove Image
                    </button>
                  </div>
                ) : (
                  <div>
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload image (max 5MB)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-block px-4 py-2 bg-black text-white rounded-lg text-sm cursor-pointer hover:bg-gray-800 transition"
                    >
                      Choose Image
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium mb-2">Caption *</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Amazing wine tasting experience at..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition resize-none"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-2">Country *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-black transition"
            >
              {countries.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tagged Entities */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tag Entities (optional)
            </label>

            {taggedEntities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {taggedEntities.map((entity) => (
                  <button
                    key={entity.id}
                    onClick={() => handleTagEntity(entity)}
                    className="px-3 py-1 bg-black text-white rounded-full text-sm flex items-center gap-2 hover:bg-gray-800 transition"
                  >
                    {entity.name}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowEntitySearch(!showEntitySearch)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-left hover:border-black transition"
            >
              {showEntitySearch ? "Close" : "Add Entity Tags"}
            </button>

            {showEntitySearch && (
              <div className="mt-3 border border-gray-300 rounded-xl max-h-64 overflow-y-auto">
                <input
                  type="text"
                  value={entitySearchQuery}
                  onChange={(e) => setEntitySearchQuery(e.target.value)}
                  placeholder="Search entities..."
                  className="w-full px-4 py-3 border-b border-gray-200 focus:outline-none"
                />
                <div className="max-h-48 overflow-y-auto">
                  {filteredEntities.map((entity) => {
                    const isTagged = taggedEntities.find(
                      (e) => e.id === entity.id
                    );
                    return (
                      <button
                        key={entity.id}
                        onClick={() => handleTagEntity(entity)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${
                          isTagged ? "bg-gray-100" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{entity.name}</p>
                            <p className="text-xs text-gray-500">
                              {entity.address}
                            </p>
                            <div className="flex gap-1 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded">
                                {entity.country}
                              </span>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded capitalize">
                                {entity.type}
                              </span>
                            </div>
                          </div>
                          {isTagged && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </span>
            ) : editingVideo ? (
              "Update"
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Static Pages Component
function StaticPage({ page, onClose }) {
  const content = {
    about: {
      title: 'About W1NE',
      content: `W1NE is your personal wine discovery platform. We connect wine enthusiasts with the best wine bars, shops, wineries, and restaurants around the world.

Our mission is to make wine discovery social, accessible, and enjoyable for everyone. Whether you're a sommelier or just starting your wine journey, W1NE helps you find your next favorite place.

Founded in 2026, W1NE combines AI-powered search with community-driven content to create the ultimate wine discovery experience.`
    },
    impressum: {
      title: 'Impressum',
      content: `W1NE Platform
[Your Company Name]
[Your Address]
[City, Postal Code]
[Country]

Email: info@w1ne.app
Phone: [Your Phone]

Registration: [Company Registration Number]
VAT ID: [VAT Number]

Responsible for content: [Your Name]`
    },
    privacy: {
      title: 'Privacy Policy',
      content: `Last updated: January 2026

1. Information We Collect
We collect information you provide directly, including email addresses, preferences, and content you create.

2. How We Use Your Information
- To provide and improve our services
- To communicate with you
- To personalize your experience
- To ensure platform security

3. Data Storage
Your data is stored securely using industry-standard encryption. We use localStorage for session management and our backend services comply with GDPR.

4. Your Rights
You have the right to access, correct, or delete your personal data at any time.

5. Contact
For privacy concerns: privacy@w1ne.app`
    },
    cookies: {
      title: 'Cookie Policy',
      content: `Last updated: January 2026

W1NE uses cookies and similar technologies to provide and improve our services.

Types of Cookies We Use:

1. Essential Cookies
Required for the platform to function. These include authentication and session management.

2. Preference Cookies
Remember your settings and preferences, such as selected region.

3. Analytics Cookies
Help us understand how you use W1NE to improve the experience.

Managing Cookies:
You can control cookies through your browser settings. Note that disabling certain cookies may limit platform functionality.

For questions: cookies@w1ne.app`
    },
    terms: {
      title: 'Terms of Use',
      content: `Last updated: January 2026

1. Acceptance of Terms
By using W1NE, you agree to these Terms of Use.

2. Age Requirement
You must be 18+ to use W1NE. By verifying your age, you confirm you meet this requirement.

3. User Content
- You retain rights to content you create
- You grant W1NE license to display and distribute your content
- You are responsible for content you post
- Prohibited: Spam, harassment, illegal content

4. User Conduct
- Be respectful to other users
- Provide accurate information
- Don't misuse the platform
- Follow local laws regarding alcohol

5. Liability
W1NE is provided "as is." We are not liable for:
- Third-party content or services
- Decisions made based on platform information
- Service interruptions

6. Changes to Terms
We may update these terms. Continued use constitutes acceptance.

7. Contact
For questions: legal@w1ne.app`
    }
  };

  const pageContent = content[page] || content.about;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-2xl font-bold">{pageContent.title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="prose max-w-none whitespace-pre-line">
            {pageContent.content}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
