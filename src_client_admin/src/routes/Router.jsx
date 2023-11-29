import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PostList from "@/features/PostList";
import PostDetail from "@/features/PostDetail";

const Router = () => {
    const rt = createBrowserRouter([
        {
            path: "/posts",
            element: <PostList />,
        },
        {
            path: "/posts/:postId",
            element: <PostDetail />,
        },
        {
            path: "/posts/:postId/comments",
            element: <PostDetail />,
        },
        {
            path: "/posts/:postId/comments/:commentId",
            element: <PostDetail />,
        },
    ]);

    return (
        <RouterProvider router={rt} />
    )
}

export default Router;