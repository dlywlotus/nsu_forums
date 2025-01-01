import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./main.css";
import PostExpandViewPage from "./pages/ExpandedPostPage";
import NotFoundPage from "./pages/NotFoundPage";
import AuthPage from "./pages/AuthPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "./Hooks/useUser";
import CreatePostPage from "./pages/CreatePostPage";
import MainHeader from "./components/MainHeader";
import PostDashboardPage from "./pages/PostDashboardPage";

const queryClient = new QueryClient();

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
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <PostDashboardPage />,
      },
      {
        path: "/post/:postId",
        element: <PostExpandViewPage />,
      },
      {
        path: "create",
        element: <CreatePostPage />,
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
