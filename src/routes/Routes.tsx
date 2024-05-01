import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useAuth } from "../provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import Login, { action as LoginAction } from "./Login";
import Logout from "./Logout";
import Root, { loader as RootLoader, action as RootAction } from "./Root";
import PostPage, { loader as PostPageLoader } from "./PostPage";
import ErrorPage from '../error-page';

const Routes = () => {
  const authData = useAuth();

  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          loader: RootLoader,
          action: RootAction,
          element: < Root />,
          children: [
            {
              path: "/posts/:_id",
              loader: PostPageLoader,
              element: <PostPage />,
              errorElement: <ErrorPage />,
            },
          ],
        },
        {
          path: "/logout",
          element: <Logout />,
        }
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      action: LoginAction(authData),
      element: < Login />,
      errorElement: <ErrorPage />,
    },
  ];

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...(!authData.token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;