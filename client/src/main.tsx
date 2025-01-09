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
import CreatePostModal from "./components/CreatePostModal";

const queryClient = new QueryClient();

const Layout = () => {
  useTheme();

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
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <PostDashboardPage />,
      },
      {
        path: "create",
        element: <CreatePostModal />,
      },
      {
        path: "/post/:postId",
        element: <PostExpandViewPage />,
      },
      {
        path: "edit/:postId",
        element: <PostExpandViewPage isEditing={true} />,
      },

      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
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
