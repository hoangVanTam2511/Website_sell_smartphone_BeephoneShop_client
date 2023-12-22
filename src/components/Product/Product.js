import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AddItemNavbar } from "../../store/navbarSlice";
import "./Product.scss";

const Product = ({ product }) => {
  const dispatch = useDispatch();

  useEffect(() => {});

  const formatMoney = (number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);
  };

  return (
    <Link
      to={`/product/` + product.id}
      style={{ marginRight: 12 }}
      onClick={() => {
        var data = [
          {
            path: "/products/all",
            name: "Điện thoại",
          },
          {
            path: `/product/${product.id}`,
            name: `${product.tenSanPham + " " + product.dungLuongRom + " GB"}`,
          },
        ];
        dispatch(AddItemNavbar(data));
      }}
    >
      <div
        className="product-item bg-white"
        style={{
          width: "220px",
          height: "330px",
          margin: "10px auto",
        }}
      >
        {product.donGiaSauKhuyenMai === 0 ? (
          <>
            <div
              className="category"
              style={{
                backgroundColor: `#128DE2`,
                position: "relative",
                width: "40%",
                top: "1px",
                borderTopLeftRadius: `8px`,
                borderTopRightRadius: `20px`,
                borderBottomRightRadius: `20px`,
                fontWeight: "600",
                opacity: 0,
              }}
            >
              Giảm{" "}
              {((product.donGiaSauKhuyenMai / product.donGia) * 100).toFixed(0)}
              %
            </div>
          </>
        ) : (
          <>
            <div
              className="category"
              style={{
                backgroundColor: `#128DE2`,
                position: "relative",
                width: "40%",
                top: "1px",
                borderTopLeftRadius: `8px`,
                borderTopRightRadius: `20px`,
                borderBottomRightRadius: `20px`,
                fontWeight: "600",
              }}
            >
              Giảm{" "}
              {(
                ((product.donGia - product.donGiaSauKhuyenMai) /
                  product.donGia) *
                100
              ).toFixed(0)}
              %
            </div>
          </>
        )}

        <div className="product-item-img">
          <img
            style={{ width: "75%", margin: "0px auto" }}
            src={product.duongDan}
            alt=""
          />
        </div>
        <div className="product-item-info fs-14">
          <div className="brand" style={{ height: 50 }}>
            <span className="fw-6" style={{ fontSize: "14px" }}>
              {product.tenSanPham + " " + product.dungLuongRom + " GB"}
            </span>
          </div>

          <div
            className="product-item-info"
            style={{
              display: `flex`,
              marginLeft: "-12px",
            }}
          >
            <div className="product-info">{product.dungLuongRam + " GB "}</div>

            <div className="product-info">{product.dungLuongRom + " GB"}</div>
          </div>

          <div className="price flex align-center">
            <span className="new-price" style={{ color: "rgb(18, 141, 226)" }}>
              {formatMoney(
                product.donGiaSauKhuyenMai === 0
                  ? product.donGia
                  : product.donGiaSauKhuyenMai
              )}
            </span>
            {product.donGiaSauKhuyenMai === 0 ? (
              <></>
            ) : (
              <span className="old-price">{formatMoney(product.donGia)}</span>
            )}
          </div>

          <div style={{ color: 'yellow' }}>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <i className='fa-solid fa-star'></i>
            <span style={{ color: 'gray' }}>(5000)</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Product;
