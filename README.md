# odin-blog-api

This project was completed as part of The Odin Project's 'NodeJS' course.

The concept of the application is a 'blog' website; users can view posts and
leave comments in response to those posts, and also leave replies in response to
other comments.

There are two front-end applications: one for viewing posts and leaving
comments, and one for creating new posts and editing and deleting existing
posts and comments. The latter has a /login route which can be used to generate
a JSON Web Token that is stored on the client's device; this is what allows the
user to perform the CRUD operations on posts and comments that are normally
protected from other users.