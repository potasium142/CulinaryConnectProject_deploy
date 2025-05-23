import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Breadcrumb.css";

function Breadcrumb() {
  const location = useLocation();
  const pathname = location.pathname;
  const pathnames = pathname.split("/").filter((x) => x);

  const hiddenPaths = [
    "/",
    "/profile",
    "/edit_profile",
    "/sign_in",
    "/register",
    "/token",
    "/food_detail",
    "/food_detail/:id",
    "/order_detail/:id",
    "/blog_detail/:id",
    "/list_product_search_img"
  ];

  if (hiddenPaths.includes(pathname) || pathname.includes("food_detail")) {
    return null;
  }
  if (hiddenPaths.includes(pathname) || pathname.includes("list_product_search_img")) {
    return null;
  }
  if (hiddenPaths.includes(pathname) || pathname.includes("order_detail")) {
    return null;
  }
  if (hiddenPaths.includes(pathname) || pathname.includes("blog_detail")) {
    return null;
  }

  // Mapping các tên đường dẫn sang tên hiển thị
  const routeNameMap = {
    food_card: "Menu",
    recipe: "Recipe",
    cart: "Cart",
    contact: "Contact",
    order: "Order",
    invoice: "Order",
    blog: "Blog"
  };

  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item link">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          let displayName = routeNameMap[name] || name;
          return isLast ? (
            <li
              key={index}
              className="breadcrumb-item active"
              aria-current="page"
            >
              {displayName}
            </li>
          ) : (
            <li key={index} className="breadcrumb-item">
              <Link to={routeTo}>{displayName}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
