import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/ptsgn_logo.png";
import profile from "../../assets/profile.png";
import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Loading from "../../components/Loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigation, setNavigation] = useState([
    { name: "Dashboard", href: "/admin", current: true },
    { name: "Kelola Cuti", href: "/admin/kelolacuti", current: false },
    { name: "Riwayat Cuti", href: "/admin/riwayatcuti", current: false },
  ]);

  const handleNavClick = (clickedHref) => {
    setNavigation((prevNav) =>
      prevNav.map((item) => ({
        ...item,
        current: item.href === clickedHref,
      }))
    );
    setSidebarOpen(false);
  };

  useEffect(() => {
    setNavigation((prev) =>
      prev.map((item) => ({
        ...item,
        current: item.href === window.location.pathname,
      }))
    );
  }, [navigate]);

  const logoutHandler = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Dialog as="div" className="relative z-50 lg:hidden" open={sidebarOpen} onClose={setSidebarOpen}>
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />

        <div className="fixed inset-0 flex max-w-full">
          <DialogPanel className="relative mr-16 flex w-screen max-w-mdy flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button type="button" className="-m-2 p-2 text-white" onClick={() => setSidebarOpen(false)}>
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="size-6" aria-hidden="true" />
              </button>
            </div>

            <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-sky-900 px-6 pb-4">
              <div className="flex h-14 mt-2 shrink-0 items-center justify-center">
                <img className="size-10" src={logo} alt="PT SGN" />
                <p className="text-white font-bold">PT SGN - PG SRAGI</p>
              </div>
              <div className="flex gap-1 flex-col">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={classNames(item.current ? "bg-sky-950 text-white" : "text-gray-300 hover:bg-sky-950 hover:text-white", "group flex gap-y-3 rounded-md p-2 text-sm font-semibold leading-6")}
                  >
                    {item.name}
                  </Link>
                ))}
                <button onClick={logoutHandler} className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-sky-950 hover:text-white">
                  Logout
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-3 overflow-y-auto bg-sky-900 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center justify-center">
            <img className="size-10" src={logo} alt="PT SGN" />
            <p className="text-white font-bold">PT SGN - PG SRAGI</p>
          </div>
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => handleNavClick(item.href)}
                className={classNames(item.current ? "bg-sky-950 text-white" : "text-gray-300 hover:bg-sky-950 hover:text-white", "group flex gap-y-3 rounded-md p-2 text-sm font-semibold leading-6")}
              >
                {item.name}
              </Link>
            ))}

            <button onClick={logoutHandler} className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-300 hover:bg-sky-950 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="size-6" aria-hidden="true" />
          </button>

          <div className="flex flex-1 self-stretch justify-end">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">{user?.username || "Guest"}</span>
              <img className="ml-3 size-8 rounded-full" src={profile} alt="" />
            </div>
          </div>
        </div>

        <main className="py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
