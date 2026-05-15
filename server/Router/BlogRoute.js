const express = require("express");
const router = express.Router();
const blogController = require("../Controllers/BlogController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.get("/blog", blogController.getListBlog);
router.get("/blog/:slug", blogController.getBlogBySlug);

router.get(
  "/blog-admin/list",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  blogController.getListBlogAdmin,
);
router.get(
  "/blog-admin/:id",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  blogController.getBlogById,
);
router.post(
  "/blog/create",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  blogController.postBlog,
);
router.put(
  "/blog/update/:id",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  blogController.updateBlog,
);
router.delete(
  "/blog/delete/:id",
  [authMiddleware.isAuthentication, authMiddleware.isAdmin],
  blogController.deleteBlog,
);

module.exports = router;
