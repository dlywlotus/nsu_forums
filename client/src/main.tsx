import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./main.css";
import PostExpandViewPage from "./pages/ExpandedPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./Hooks/useUser";
import MainHeader from "./components/MainHeader";
import PostDashboardPage from "./components/PostDashboard";
import useTheme from "./Hooks/useTheme";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import { ToastContainer } from "react-toastify";
import { SkeletonTheme } from "react-loading-skeleton";

const queryClient = new QueryClient();

const ThemeProvider = () => {
  useTheme(); //dark / light mode
  return (
    <SkeletonTheme
      baseColor='var(--clr-body)'
      highlightColor='var(--clr-accent-400)'
      duration={0.75}
    >
      <Outlet />
      <ToastContainer />
    </SkeletonTheme>
  );
};

const Layout = () => {
  return (
    <>
      <MainHeader />
      <div className='container'>
        <Outlet />
      </div>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ThemeProvider />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            path: "/",
            element: <PostDashboardPage />,
          },
          { path: "create", element: <CreatePostPage /> },
          {
            path: "post/:postId",
            element: <PostExpandViewPage />,
          },
          {
            path: "edit/:postId",
            element: <PostExpandViewPage isEditing={true} />,
          },
        ],
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </QueryClientProvider>
  </StrictMode>
);
