import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PostList from "@/features/PostList";
import Post from "@/features/Post";

const Router = () => {
    const rt = createBrowserRouter([
        {
            path: "/posts",
            element: <PostList />,
        },
        {
            path: "/posts/:postId",
            element: <Post />,
        },
        {
            path: "/posts/:postId/comments",
            element: <Post />,
        },
        {
            path: "/posts/:postId/comments/:commentsId",
            element: <Post />,
        },
    ]);

    return (
        <RouterProvider router={rt} />
    )
}

export default Router;