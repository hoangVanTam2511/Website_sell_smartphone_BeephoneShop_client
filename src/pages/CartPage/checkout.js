import React, {useState} from "react";
import "./CartPage.scss";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";


const CartPage = () => {

  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  return (
    <>
      <div style={{ width: "90%", margin: "0px auto" }}>
        <div>THÔNG TIN KHÁCH HÀNG</div>

        <div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="male" control={<Radio />} label="Anh" />
            <FormControlLabel value="female" control={<Radio />} label="Chị" />
          </RadioGroup>
        </div>

        <div>
          <TextField
            id="outlined-basic"
            label="Họ và tên"
            variant="outlined"
            style={{ width: 230 }}
          />
          <TextField
            id="outlined-basic"
            label="Số điện thoại"
            variant="outlined"
            style={{ width: 230, marginLeft: 20, fontSize: 16 }}
          />
        </div>

        <div style={{ margin: "10px 0" }}>CHỌN CÁCH THỨC NHẬN HÀNG</div>
        <div>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="male"
              control={<Radio />}
              label="Giao tận nơi"
            />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Nhận tại cửa hàng"
            />
          </RadioGroup>
        </div>

        <div>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Chọn địa chỉ để biết thời gian nhận hàng và phí vận chuyển (nếu
                có)
              </Typography>

            </CardContent>
          </Card>
        </div>
      </div>
      <br />
    </>
  );
};

export default CartPage;
