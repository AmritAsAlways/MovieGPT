import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Browse from "./Browse";

// ROUTING: a route table that maps a URL path to the component to show.
//   "/"        -> Login page
//   "/browse"  -> Browse page (the movie UI, shown after sign in)
//
// createBrowserRouter uses the browser's History API, so URLs look normal
// (/browse) instead of having a # in them. Navigating between routes does
// not reload the page: React Router swaps the component instead.
//
// Why it is created OUTSIDE the component: if it lived inside Body, a brand
// new router would be built every time Body re-renders, which wastes work
// and can reset navigation state. Module level means it is built exactly once.
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
]);

// RouterProvider renders whichever route matches the current URL.
// In Section 3, Header will use the useNavigate() hook to redirect users
// between "/" and "/browse" based on whether they are signed in.
const Body = () => {
  return <RouterProvider router={appRouter} />;
};

export default Body;
