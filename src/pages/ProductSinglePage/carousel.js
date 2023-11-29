import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./style.css";

export default function App(props) {
  const [itemSelected, setItemSelected] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(props.images);
  });
  const cssNoSelected = () => {
    return {
      width: "10%",
      height: "20%",
      borderRadius: "10px",
      marginRight: "10px",
      border: "1px solid #d1d5db",
    };
  };

  const handleChangeSlide = (data) => {
    if (data === "left") {
      var value = itemSelected - 1;
      if (value < 0) {
        setItemSelected(items.length - 1);
      } else {
        setItemSelected(value);
      }
    } else {
      var value = itemSelected + 1;
      if (value > items.length - 1) {
        setItemSelected(0);
      } else {
        setItemSelected(value);
      }
    }
  };

  const cssSelected = () => {
    return {
      width: "10%",
      height: "20%",
      borderRadius: "10px",
      marginRight: "10px",
      border: "1px solid rgb(18, 141, 226)",
    };
  };

  return (
    <div>
      {items.length === 0 ? (
        <>
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 24,
                }}
                spin
              />
            }
          />
        </>
      ) : (
        <>
          <div
            id="toRight"
            style={{
              backgroundImage: `url(${items[itemSelected].url})`,
              width: "95%",
              borderRadius: "10px",
              border: "1px solid #d1d5db",
              height: "347px",
              backgroundRepeat: `no-repeat`,
              backgroundPosition: "center",
            }}
          >
            <i
              class="fa fa-angle-left arrow arrow-left"
              onClick={() => handleChangeSlide("left")}
            ></i>

            <i
              class="fa fa-angle-right arrow arrow-right"
              onClick={() => handleChangeSlide("right")}
            ></i>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "20px",
              position: "relative",
              left: "31%",
            }}
          >
            {items.map((item, index) => (
              <img
                src={item.url}
                alt=""
                onClick={() => setItemSelected(index)}
                style={index === itemSelected ? cssSelected() : cssNoSelected()}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
