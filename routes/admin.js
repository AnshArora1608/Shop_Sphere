const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { checkAuth, admin } = require("../middleware/auth");
const topbarData = require("../middleware/notification");
const adminData = require("../middleware/adminData");

const {
    dashboard,
    allProducts,
    allOrders,
    allUsers,
    allReviews,
    analytics,
    deleteProduct,
    deleteReview,
    updateOrderStatus,
    editProductPage,
    deleteUser,
    updateProduct,
    settingsPage,
    updateSettings,
    adminSearch,
    saveContact,
    getNotifications,
    getMessages,
    markNotificationRead,
    markMessageRead,
    bulkAddProducts,
    bulkProductPage,
} = require("../controllers/admin");

const {
    addProductPage,
    addProduct
} = require("../controllers/product");

// Apply middleware to all admin routes
router.use(checkAuth, admin, topbarData,adminData);

// Dashboard
router.get("/dashboard", dashboard);

// Products
router.get("/products", allProducts);
router.get("/product/add", addProductPage);
router.get("/products/edit/:id", editProductPage);
router.post("/product/add", upload.single("image"), addProduct);
router.post("/product/edit/:id", upload.single("image"), updateProduct);
router.post("/product/delete/:id", deleteProduct);

//bulk-add
router.get("/products/bulk-add", bulkProductPage);
router.post(
    "/products/bulk-add",
    upload.array("files", 101),
    bulkAddProducts
);


// Orders
router.get("/orders", allOrders);
router.post("/order/:id", updateOrderStatus);

// Users
router.get("/users", allUsers);
router.post("/user/delete/:id", deleteUser);

// Reviews
router.get("/reviews", allReviews);
router.post("/review/delete/:id", deleteReview);

// Analytics
router.get("/analytics", analytics);

// Settings
router.get("/settings", settingsPage);
router.post("/settings", updateSettings);

// Search
router.get("/search", adminSearch);

// Contact
router.post("/contact", saveContact);
// Notifications
router.get("/notifications", getNotifications);
router.get("/notifications/read/:id", markNotificationRead);


// Messages
router.get("/messages", getMessages);
router.get("/message/read/:id", markMessageRead);
module.exports = router;