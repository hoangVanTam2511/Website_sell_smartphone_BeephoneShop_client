import React, { useEffect, useState } from 'react'
import './CategoryProductPage.scss'
import './CategoryProduct.css'
import ProductListNormal from '../../components/ProductList/ProductListNormal'
import { useDispatch, useSelector } from 'react-redux'
import { getCategoryProductsStatus } from '../../store/categorySlice'
import Loader from '../../components/Loader/Loader'
import { STATUS } from '../../utils/status'
import axios from 'axios'
import { ResetSelectedCart } from '../../store/cartSlice'
import { AddItemNavbar } from '../../store/navbarSlice'
import Button from '@mui/material/Button'
import { Empty,  Slider } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { request, setAuthHeader } from '../../helpers/axios_helper'
import { setUserNoToken } from '../../store/userSlice'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const CategoryProductPage = () => {
  const dispatch = useDispatch()
  const categoryProductsStatus = useSelector(getCategoryProductsStatus)
  // const searchInput = useRef(null);
  const [products, setProducts] = useState([])
  const [listChip, setlistChip] = useState([])
  const [listRam, setListRam] = useState([])
  const [listManHinh, setlistManHinh] = useState([])
  const [listRom, setlistRom] = useState([])
  const [listDanhMuc, setListDanhMuc] = useState([])
  const [listTanSoQuet, setListTanSoQuet] = useState([])
  const [priceBiggest, setpriceBiggest] = useState(0)
  const [productDetails, setProductDetails] = useState([])

  //filter
  const [showFilter, setShowFilter] = useState(0)
  const [priceFillter, setpriceFillter] = useState([])
  const [ramFillter, setRamFillter] = useState([])
  const [romFillter, setRomFillter] = useState([])
  const [chipFillter, setChipFillter] = useState([])
  const [displayFillter, setdisplayFillter] = useState([])
  const [refreshRateFillter, setRefreshRateFillter] = useState([])
  const [danhMucFillter, setDanhMucFillter] = useState([])
  const [productFillter, setProductFillter] = useState([])
  const [brandFillter, setBrandFillter] = useState()
  const [priceZone, setPriceZone] = useState({
    max: 0,
    min: 0
  })

  //user param
  const { brand } = useParams()
  const flag = useSelector(state => state.navbar.flag)
  const navbar = useSelector(state => state.navbar.navbar)
  const navigate = useNavigate();

  // loading 
  const [isLoadingRequest, setIsLoadingRequest ] = useState(0)

  const [chiTietSanPham, setchiTietSanPham] = useState({
    sanPham: '',
    dongSanPham: '',
    nhaSanXuat: brand === 'all' ? '' : brand,
    mauSac: '',
    pin: '',
    ram: '',
    rom: '',
    chip: '',
    manHinh: '',
    donGiaMin: '',
    donGiaMax: '',
    trangThai: '',
    tanSoQuet: ''
  })

  const listLogos = [
    {
      value: 'Nokia',
      url: 'data:image/png;base64,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'
    },
    {
      value: 'Samsung',
      url: 'data:image/png;base64,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'
    },
    {
      value: 'apple',
      url: 'data:image/png;base64,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'
    },
    {
      value: 'Xiaomi',
      url: 'data:image/png;base64,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'
    },
    {
      value: 'huawei',
      url: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIRERUQExEVFhIVGBUVGRgWFxcXFRUWHhoYGRgYFxgZHSggGBslGxYWITEhJSkrLi4wGiA2ODMvNygtLisBCgoKDg0OGxAQGy8mICY1LSsuLjItLS01Ny8tLS0tNS0tLS0tLy0tListLy0tLzYtLS8tLzUtLS0rNS0tLjAvLf/AABEIAI4BYgMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcDBAgFAgH/xABPEAABAwIBCQMDDgwEBwEAAAABAAIDBBEFBgcSITFBUWFxEyKBFDWRCBcyQlJyc3SCk6GxsrMjMzRUVWKSwcLR0tNjoqPwFSUmQ1ODwxb/xAAbAQEAAgMBAQAAAAAAAAAAAAAABAUBAwYCB//EADURAAIBAgIHBQcDBQAAAAAAAAABAgMRBCEFEjFBUWFxEyIygZEUQqGxweHwBnLRI1JiY/H/2gAMAwEAAhEDEQA/ALxREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEWHtml2gHDSGsi4uB0WZAEWN0gBAJAJ2C+1ZEAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBERAEREAREQBFpYniEdPGZZXaLBtO8ncAN5PBZaadsjGyNcHNcA5pGwg7CFi6vY9astXWtlsvz4GHFcQZTxPnkNmMFzxO4AcSTYDqqbx3LKorHkaZZDs0GkgEfrW1uPXVyUszxVZbDDEDqe57j8kAD7Z9CrCkKrcZWlrai2Hafp7RtL2f2mavJ3tfck7Zc2/tzlmSNaYKiOS9hfRdzY7U6/wBfgFdKoahKufDqvSpWTH/xBx6huv6QV7wMsnHzIH6kpNzhU3u6+q+pH8Yk7Wdx3N7g8Nv03X1S1UkOtrjo+5Otp/l4Lz6abedq2pqi4UXtG5ay2mqVOyVO10siW0NU2Vge3ftG8HeCtlRjJSfvyM3WDvG9v3j0KRyPDQSSABrJOoAcSrWjPtIKRSYml2VRxMiLz8LxOKoZpxPDmglp3EEcQdY1EHoQvQWxNNXRqlGUJOMlZragiIsnkIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIi87Hp3R0s8jfZMhleOoYSPpCw3ZXMxi5NJbyoc42UZqagxNP4GIkC2xztjn89ezkOZXqZsMqezcKOV3ccfwZPtXn2vRx+nqq7dtPUr9abaxtCpFXkqnab/zI+nz0VQlg/ZNyWT5/wB3W+3jmthbueCi06eKUD2D3NPIPbt9LAPFVNA6xVt5PYmMWw+SlkI7cM0ST7a1jHJz7wF+Y3XCqSeIseWkWIJuDtBGog+K2Yq0pKotjRC0BKVOlPCVPFTfweaa5N3PXpJVaWFVf/KS6+xkjPS4gfQ4KnaadWThlR/ySU8JA3/PEf3rGHlZy6M8aaw+sqS/2QXrc04apZXVaj8dUsnlW5abnl4W7LAyHYT2km7usHXWT/CvLzhZRWvSRn4Qj6GfvPgOK3quu/4bQMbq7eQEgHc863E8QwEDwHFVXVVJJJJuTcknaTvJ5qZVqOnTVNbd/nuK7RuCWKxUsU/CnaPO2V+m9c+h7GSmUZo6lrifwT7MkH6u49Re/pG9Xa031hc0SS3KvzI6oMlDTudt0A39m7R9DV6wNR5wfUz+qMGoKGIW191/NfVenA91ERWJyIRY5JA0FziA0aySbADmTsWvFiUDyGtmjc47AHtJPQAoDcRF8k21oD6RaLcWpzqFRESdn4Rmv6VszzNY3Se5rWje4gAeJQGVFqw4hC86LJo3O4Ne0n0AraQBFimmawFznBrRtLiAB1JWCHEYXkNZNG5x2Br2knfqAKA3ERY5ZA0FxIAAJJJsABtJO4IDIi0Ri1OTYTxEnUB2jNZ9K3kARas2IQsOi+aNruDntB9BKyU9QyQaTHtc3ZdpDhfqEBmRFqzYhCw6L5o2u4Oe0H0EoDaRa9NVxyXLJGvA26Lg63Wy2EARa1RWRR2EkjGX2aTg2/S51r9p6uOS/ZyMfbbouDrdbHUgNhEWtPXRM1PlY0/rOaPrKA2UWj/xen/OIfnGfzWanq45L9nIx9tui4Ot1sdSA2EWpPiEMZ0Xyxtdts57QbdCVlp6hkg0mPa5uy7SHC/UIDMiIgC16uBsjHRuF2va5hHIix+grHik5jhlkG1rHuHUNJH1KkMls4tVSnQkd20QOx5N2t/VdtHTWNWwLVUqxhbW3k3CYCrioydK142y2Xvw3ZW3nlY7hclLO+F41tcRfcR7UjkRrWgFcc0lBjkIaH6FQAdHSAEreItfvs167H0FVjlBk9NRyaErNux41tcP1XW+jaFVVqOp3o5x4/Q73RmlFX/pVVq1Vti8r81xv+ZZn5k5i76OoZMzcdY3OafZA9R6DY7lI84+Gsc5lfCLw1ADieEltYPAkC9uIcoQp1kNWNqoJMLlOqQF0Tj7WQbh6L25OHtlik9ZOm9+zr99h70hB4eccbD3cprjDf5xfeXK6IMCrDw93/T8x/xW/XEoLiNG6GR8TxZzHODhzHDiN4Kn9FF/07NzeD6Hxg/Q0pRWcv2sxpWacaElsdSn8WQdlWpTkJRCaYzSG0FOO1e4+xuNYB9BceTeahVNA6R7Y2glziBYbSSbADxU6ysmbh9HHhsdu1eBJORvJGpt+Gr0BvFYopJ68ti+e5DSOaWHpeOeXSPvS8lkubR4eVmULquodIbhg7rG+5aL28TtPXkvAfISsa9LBMEnq5OzijJO87ABxJ2Af7C1tucuLZPhTo4WkkrKMV6JGDDaF88rImN0nOc1rRz58ANpO4ArofCqIQQxwg3EbGtvxIGs+JuVD8NpKLBYy+V4dUEXNgDIRb2LG+1bdu02vvOwCJ5Q5w6ioOhF+CjJtZp77hzf+4W8VPpuOGTc/E9yOUxqr6aqKNCNqUfeeV3xW98suti6UXlZNyF1HTuJuTFHcnedEC69VWCd1c5KpDUm48HYjecjzTW/F5fslc5Zn/PVH79/3b10bnI801vxeX7JXMeQGMRUWI09VNpdnE5xdoi7tbHNFhcbyFk8HYC16/8AFSe8d9RVdevjhXCp+bb/AFrFU57MLcxzQKi5a4fi27xb3aAoHJr8spvh4fttXSmfHzJU9YPvo1zXk1+WU3w8P22rpPPh5kqesH30aAqHMF54b8FN9QXTa5kzBed2/BTfUF02gIdnf8y1nvGfeMVE5kPPdN0m+5kV7Z3/ADLWe8Z94xUTmQ8903Sb7mRAdTqrM/eUvk1CKNjrS1RINtohbYv/AGjot5jSVouNtZ2Lk7L3Gn4tir3RXcHPbTwN4sDtFlvfOJd1egIw+mkY1kpa5rX3LHbA7RNjonkQusM2+UYxHD4qgm8oHZy8pW2Djy0hZ3RwUOzn5BsZgcUcLbvw9oeCALuYfyg8rm8h96oTmDyl8mrTRvdaKqAAvsEzblnTSGk3mdDggPf9UbgP5PiDRxp5D6Xxn7wX96vz1N+N66mgJ22qGD0Mk/8Al9KtHL3A/L8PqKUC73MJZ8K3vR693eaAeRK5mzc4z5DidPOTZok7OTXYaD+47S6aWl1aEB12uP8AOFivleJ1dQPYulLWnixlo2HxaxpXUWXOL+R4dU1N7OZE7RP+I7uR/wCdzVzpmbwJtbijGPGlFHHLI8cRo6A/zSNPggPe9TxjPZV8lIT3aiO45yR3cAPkGT0LotceUkkmFYmCb6dJUWdbVpBj7OAvuc0HwK63q8RjjgfUlw7JkbpS7doBulf0IDnDPvjPlGKOiB7lMxsQ4aR77z1u4N+SrYzN4S2hwdk0hDTNpVT3HY1hHcJPDs2td4lc94bTSYniLWH8ZVT3cRu03lz3dAC4+C6Lzv1Hk2CTsj7oLYoGgbAwua0jpoXCApzL3OnV10r44JHQUgJDGxktfI33Urhr17dEahe2u1zgwbNNitVGJexbE12sds/Qc4Hfo63DxAUdyPqqeGtgmqg4wRvD3Bo0idHvNFri40g244XV9+vhhXCo+aH9aArb1j8V40/zp/oVo5nsjanC4qhlT2d5Hsc3QdpCwBBvqFtq1/XwwrhUfND+tSjI7LOmxRsj6YSWiLWu7RobrIJFrE8EBR/qhfOw+LxfakVmep/80D4aX+FVn6oXzsPi8X2pFZnqf/NA+Gl/hQFkoiIDFNEHtLDscCD0IsVy5itC+lnkp5PZscWnnbY4ciLEciuqFAc5GQvlw7eGzapgtY6mytGwE7nDcfA7iNFem5xyLTRWMWHqtS2P5/j+JS1POQQQ4ixBBBsQRsIO4qe4Pl+XM8nrohPAdRJsZG8De9nEcdR5qAVdHLTyGKWN7Hja14IPXXtHMaivxjjwKrbypvI7R0qGMglUV+D3rmmtn5csbEsio52mow6USs2mMm0jeW70Gx6qIROlp5g6zo5GOB1ghzXDWLg7OhWLDMSmp3iSJ72uG9pPoO4jkdSsCgynpMRaIcQiDJNgnaNC3C5Otu3fdvGyWhPZ3X8PsHPFYRd9OrT4276XNbJrpZ72fuWeHtr6OPFIW9/RAmA5d0nj3TcX9zonYF62D0t8Ac3eY5n/ALL3EfQ0L1clcn3UhkjEjZaSXvtv7IO1C1h3XNc3ffcNWte3FhMbYDSi4jLHM26w1172PiVOhRldzeTas+vHzOVxGkacaccPB60YTUov/HPuu++Ldv8AhW2b/CWQRSYpOO5GHdmDvOzSHO/cHMngFC8Sqpaud8hBc+R19Vybk6g0bdQsAOQVzZT4A+pjipmPbFTssXG5Js0aLGBuy1rm5O4KKVWO0OGNMdFEJZ9hlcNIDjZw27vY2bzUarS1Uot2it/F8kW+B0i61WdaEHOrPJJbIwWxSlsV9uW3LieXhORIYzymvlFPDt0T+MdvtY3seVi7VsC+8Uy5bFH5Nh8YhiHt7DTdz32vxNz0UUxbFp6mQyTPe489gHAbgOQWhY8CtHbKKtTy57/t5FxDRsq0lUxktd7orwLy9585eiMlRO+Rxc5xc46zckkniSdZX7RwOkkaxgu5zmhoG8k2A9KUtHJI4MZG5zjsaGlzj0AVtZAZE+TEVM4Bmt3W7ezvtJOwvtq1bPqxRourKy2bz3pHSVLA0m21re7Hj/CW8mmHUgiijiv+LYxnXRAF/oW2iK7StkfMG22295G85Hmmt+Ly/ZK5gyFwVldXwUcjnNZK5wJZbSFmOdquCNrRuXT+cjzTW/F5fslc5Zn/AD1R+/f929ZMFr+sJQfnNV6Yv7ax1GYmgaxzhU1Vw0nbFuF//GreWvX/AIqT3jvqKA43yZ/Lab4eH7bV0pnw8yVPWD76Nc15NfllN8PD9tq63yswUV1HPRk27VhaCdYa8WcxxG8BwafBAc95hZAMYYCfZRTAczo3+oFdOrj+anrcGrWucx0VRC7SaSLseNhLTsewgkatxIVoUef4aI7Wg79tZZNZpPIOZdvS5QE7zxSBuC1dztbGPEysAVHZj23xqn5CY/6T/wCay5w858+KxiARCCnDg8tDi9z3C9tN1gLC99G23XrsLTPMRkTPDK7EqiMxgsLIWvFnu0iNKQg62iwsL7dInZa4Esz1ZTeRYc6JjrTVV4WcQy34V3g06N9xe1c75KY2aGqjqxE2V0Vy1r76OkQQHG3C9xzspFnhyl8vxGTRdeGn/Ax8DY99w6uvr3gNVvZuc3dHHh0BqqSKWokHavMjA5zdPW1ne2Wboi3G/FAQSXPvVOaWOoqctcCCCZLEHUQdfBVVHUlkgljuxzXB7LG5YQbtseWpdb//AIPC/wBHU3zTP5Kq8+uREFPBDW0sDImMd2UrY2hos7Wx5A1ajdt9+k3ggLayMx5uIUMNW2wMje+B7WQd17egcDblYrm3O5gXkeKzsAtHKfKGe9fcu8A8PHgpf6nnKbsp5MOee7PeWP4Vo74+UwA/+vmpH6ojAu0pIq1o71O/Qf8AByWAJ6PDR8soCOZxcsfKcAoGaR7WoNpefYDRffheQscvZ9ThhOjBU1hHs3thbq3MGk4jiCXt/ZVEuncWtYXEtaSWgnU0m17Ddew9C6yzX4V5LhVLEQQ4xiV19R0pCZCD00reCApXP9g3YYkKgDuVMbX8u0Z3HgeAYflL2K/LLSyUjjDvwznihNtoazv+gwhjT75S71QGDdvhoqAO/TSNde1z2b+44D5RjPyVziZ3aAj0joAlwbfVpEAE242A9CAtX1O+CdrWy1jh3admi3V/3JLi4PJgePlBWVnwp3Pwact16DonnoJGg+i9/BfuZXBPJcKicRZ9Reod0dYR/wCmGHxKmWJULKiGSCQXjlY6Nw4tcCD0OvagORcicKhrK+Clne5kUrtAuYWhwJadAAuBGt+iNm9Xb6wuH/nNX+1F/bVRZZ5GVeEz94O7IOvFUMuGmxu06Q9hIOHEarixUpwrPpXRsDJoYZiABp96N54l2idEnoAgJp6wuH/nNX+1F/bUvyHyIgwlkrIJJXiVzXHtC0kEAjVotHFVV6/9R+YxfOP/AJKxM1uXEmLxzyPhZF2TmNAa4uvcE679EBUnqhfOw+LxfakVmep/80D4aX+FVn6oXzsPi8X2pFZnqf8AzQPhpf4UBZKIiAIiICvMrsuqSGV1LVUT3lvu2xOY5p2ObpE3B/cRtCjD8t8I3YUzxEbfqBVhZaZIw4jEGuOhKy+hIBcj9Vw9s08PQqaxHN1iMLy3ycyDc6Mh7XcxvHiAotXtE+K6F3gI4Oce83GW/vNX5okAy5w7dg8Xi5v9tbeFZSwVMjY4MFic47gQbDiT2YAHM6lo5MZqKmQh9U7sWe5BDpHdALtb1NzyVuYJgkFHH2UEYY3edrnHi5x1k/7C8wp1JPPJdF/BIxOLwNKOrTi5S/fOy9JZ+Rlwim7OJrezjjOslkWtjSSSdE2F9vBb6IpaVlY52UnJuT3mpiEAfG9mix9wRov9gTuDtR1X5FVnjOPRUshZPg0Qdu2WI90HaFnDorXWhi2Fw1MZiljD2njtB4tI1tPMLXVpuXhdn0T+ZNwOKp0ZWqwcovhKUX5Wkk/P1RVTctqD9EQ+Dm/21sx5aYZvwxg6NYfraFiylzYysJfSntG+4JDZB0OprvoPIqN0uQuISODfJnt4ucQxo5kk6/C6gvtouzXwR1UVoqrDXjNrrOSfo38iw8n8uKN8raenonNdIQ20TYh1LrEagLkngFYKiOReRsdA3SNpJ3CxfbU0b2svu4nabdAJcp1JTUe+cpj5YZ1n7Onq8W73fH868giItpCNespGTRuikYHxvBa5rtYcDtBHBeRh+RuHwSNmiooY5Ga2uawBzTa2o9CV76IAviRoIIIuDqPRfaICNxZCYYxwe2ggDmkOBDBcEG4I53UkREBqV+HQ1DNCaKOVnuZGNe30OBUcmzaYQ83NBF8nSaPQ1wClyIDwcLyPw+mcHw0UDHjY4MaXjo43IXuOFxbivpEBGfW/wr9H0/zYUmREAWpiNBFURuhmjbJE62kx4BabEEXB4EA+C20QEeo8isOhkbLHRQMkYQ5rmsAc0jYQQvXr6KOeN0MrGvjeLOa4Xa4bdY6hbSICMet9hX6Pp/mwpK0WFhsC+kQGvWUjJo3RSMD43gtc1wu1wO0ELwPW+wr9H0/zYUnRAYoow1oa0ANaAABsAGoALKiIDFLE14LXNDmnUQQCCOYO1eDNkLhbzc4fTX5RMH1BSNEBGfW/wr9H0/zYXp4PgVLRhwpoI4Q8guDG6IcRsJ9K9NEB4mLZK0NVJ2tRSRSyWDdJ7QTYXsL8NZW7hWFQUsfZU8TIo7l2iwWbc7TZbyIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiAIiIAiIgCIiA/9k='
    },
    {
      value: 'sony',
      url: 'data:image/png;base64,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'
    },
    {
      value: 'oneplus',
      url: 'data:image/png;base64,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'
    }
  ]

  const [listPrice, setListPrice] = useState([
    {
      label: 'Trên 15 triệu',
      min: 15000000,
      max: 1000000000000
    },
    {
      label: 'Dưới 500.000',
      min: 0,
      max: 499999
    },
    {
      label: 'Từ 500.000 - 1 triệu',
      min: 500000,
      max: 1000000
    },
    {
      label: 'Từ 1 triệu - 3 triệu',
      min: 1000000,
      max: 3000000
    },
    {
      label: 'Từ 3 triệu - 5 triệu',
      min: 3000000,
      max: 5000000
    },
    {
      label: 'Từ 5 triệu - 7 triệu',
      min: 5000000,
      max: 7000000
    },
    {
      label: 'Từ 7 triệu - 10 triệu',
      min: 7000000,
      max: 10000000
    },
    {
      label: 'Từ 10 triệu - 15 triệu',
      min: 10000000,
      max: 15000000
    }
  ])

  useEffect(() => {
    console.log(String(brand) === 'all')
    if (String(brand) === 'all') {
      searchProductsAll('')
      deleteAll()
      if (navbar.length > 1) {
        var data = [
          {
            path: '/products/all',
            name: 'Điện thoại'
          }
        ]
        dispatch(AddItemNavbar(data))
        
      }
    }else{
      searchProductsAll(brand)
      setBrandFillter(brand)
      // resultSearch()
    }

    if (listRam.length === 0) {
      loadDataComboBox()
      dispatch(ResetSelectedCart())
      loadListProductDetails()
      window.scrollTo(0, 0)
    }
  }, [dispatch, chiTietSanPham, flag, brand])

  const loadDataComboBox = async () => {
    request("GET",`/client/danh-muc/get-list`)
      .then(response => {
        const modifiedData = response.data.map((item, index) => ({
          label: item.tenDanhMuc,
          value: item.id
        }))
        setListDanhMuc(modifiedData)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })

      request("GET",`/client/ram/get-all-ram`)
      .then(response => {
        const modifiedData = response.data.map((item, index) => ({
          label: item.dungLuong + ' GB',
          value: item.id
        }))
        setListRam(modifiedData)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })

      request("GET",`/client/rom/get-all-rom`)
      .then(response => {
        const modifiedData = response.data.map((item, index) => ({
          label: item.dungLuong + ' GB',
          value: item.id
        }))
        setlistRom(modifiedData)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })

      request("GET",`/client/chip/get-list-chips`)
      .then(response => {
        const modifiedData = response.data.map((item, index) => ({
          label: item.tenChip,
          value: item.id
        }))
        setlistChip(modifiedData)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })

      request("GET",`/client/display/get-list-displays`)
      .then(response => {
        const modifiedData = response.data.map((item, index) => ({
          label: item.kichThuoc + ' inch',
          value: item.kichThuoc
        }))

        const modifiedDataTanSoQuet = response.data.map((item, index) => ({
          label: item.tanSoQuet + ' Hz',
          value: item.tanSoQuet
        }))
        setlistManHinh(modifiedData)
        setListTanSoQuet(modifiedDataTanSoQuet)
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })

      request("GET",`/client/product-detail/get-max-price`)
      .then(response => {
        setpriceBiggest(response.data)
        setPriceZone({...priceZone, 
          min: 0,
          max: response.data
        })
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })
  }

  const searchProducts = async () => {
    
    request("POST",`/client/product-detail/search`,
        chiTietSanPham
      )
      .then(res => {
        if (res.status === 200) {
          setProducts(res.data)
          setProductFillter(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })
  }

  const searchProductsAll = async data => {
    console.log(data)
    request("POST",`/client/product-detail/search`, {
        sanPham: '',
        dongSanPham: '',
        nhaSanXuat: data,
        mauSac: '',
        pin: '',
        ram: '',
        rom: '',
        chip: '',
        manHinh: '',
        donGiaMin: '',
        donGiaMax: '',
        trangThai: '',
        tanSoQuet: ''
      })
      .then(res => {
        console.log(res)
        if (res.status === 200) {
          console.log(res.data)
          setProducts(res.data)
          setProductFillter(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
      })
  }

  const loadListProductDetails = async () => {
    request("GET",`/client/product-detail/get-product-detail`)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data)
          setProductDetails(res.data)
        }
      })
      .catch(error => {
        console.log(error)
        setUserNoToken()
        navigate("/login")
      })
  }

  const itemNotSelected = () => {
    return {
      alignItems: `center`,
      background: `#fff`,
      border: `1px solid #e5e7eb`,
      borderRadius: `6px`,
      color: `#444`,
      cursor: `pointer`,
      display: `flex`,
      fontSize: `14px`,
      height: `34px`,
      margin: `0 10px 10px 0`,
      padding: `5px 10px`,
      whiteSpace: `nowrap`
    }
  }

  const itemSelected = () => {
    return {
      alignItems: `center`,
      background: `rgb(18 141 226 / 7%)`,
      border: `1px solid rgb(18, 141, 226)`,
      borderRadius: `6px`,
      color: `#444`,
      cursor: `pointer`,
      display: `flex`,
      fontSize: `14px`,
      height: `34px`,
      margin: `0 10px 10px 0`,
      padding: `5px 10px`,
      whiteSpace: `nowrap`,
      color: 'rgb(18, 141, 226)'
    }
  }

  const selectSelected = () => {
    return {
      alignItems: `center`,
      background: `rgb(18 141 226 / 7%)`,
      border: `1px solid rgb(18, 141, 226)`,
      borderRadius: `6px`,
      color: `#444`,
      cursor: `pointer`,
      display: `flex`,
      fontSize: `14px`,
      height: `34px`,
      margin: `0 10px 10px 0`,
      padding: `5px 10px`,
      whiteSpace: `nowrap`,
      position: 'relative',
      color: 'rgb(18, 141, 226)'
    }
  }

  const selectNotSelected = () => {
    return {
      alignItems: `center`,
      background: `#fff`,
      border: `1px solid #e5e7eb`,
      borderRadius: `6px`,
      color: `#444`,
      cursor: `pointer`,
      display: `flex`,
      fontSize: `14px`,
      height: `34px`,
      margin: `0 10px 10px 0`,
      padding: `5px 10px`,
      whiteSpace: `nowrap`,
      position: 'relative'
    }
  }

  const overFlowHasItemCss = () => {
    return {
      width: '100%',
      overflowY: 'auto',
      height: `60%`,
      display: 'flex',
      flexWrap: 'wrap',
      minHeight: '56%',
      maxHeight: '46%'
    }
  }

  const overFlowNoItemCss = () => {
    return {
      width: '100%',
      overflowY: 'auto',
      height: `88%`,
      display: 'flex',
      flexWrap: 'wrap',
      minHeight: '56%',
      maxHeight: '86%'
    }
  }

  const brandsCssNotSelected = () => {
    return {
      alignItems: `center`,
      border: `1px solid #e5e7eb`,
      borderRadius: `4px`,
      display: `flex`,
      height: `34px`,
      justifyContent: `center`,
      margin: `0 10px 10px 0`,
      padding: `2px 4px`
    }
  }

  const brandsCssSelected = () => {
    return {
      alignItems: `center`,
      border: `1px solid rgb(18, 141, 226)`,
      borderRadius: `4px`,
      display: `flex`,
      height: `34px`,
      justifyContent: `center`,
      margin: `0 10px 10px 0`,
      padding: `2px 4px`
    }
  }

  const checkRam = ram => {
    for (var i = 0; i < ramFillter.length; i++) {
      if (ramFillter[i].value === ram.value) return true
    }
    return false
  }

  const checkRom = ram => {
    for (var i = 0; i < romFillter.length; i++) {
      if (romFillter[i].value === ram.value) return true
    }
    return false
  }

  const checkDisplay = ram => {
    for (var i = 0; i < displayFillter.length; i++) {
      if (displayFillter[i].value === ram.value) return true
    }
    return false
  }

  const checkTanSoQuet = ram => {
    for (var i = 0; i < refreshRateFillter.length; i++) {
      if (refreshRateFillter[i].value === ram.value) return true
    }
    return false
  }

  const checkChip = ram => {
    for (var i = 0; i < chipFillter.length; i++) {
      if (chipFillter[i].value === ram.value) return true
    }
    return false
  }

  const checkPrice = ram => {
    for (var i = 0; i < priceFillter.length; i++) {
      if (priceFillter[i].min === ram.min) return true
    }
    return false
  }

  const checkDanhMuc = ram => {
    for (var i = 0; i < danhMucFillter.length; i++) {
      if (danhMucFillter[i].value === ram.value) return true
    }
    return false
  }

  const resultSearch = () => {
    window.scrollTo(0, 175)
    setShowFilter(0)
    setIsLoadingRequest(1)
    // fillter
    if (
      ramFillter.length === 0 &&
      romFillter.length === 0 &&
      displayFillter.length === 0 &&
      refreshRateFillter.length === 0 &&
      chipFillter.length === 0 &&
      priceFillter.length === 0 &&
      danhMucFillter.length === 0 &&
      brand === 'all'
    ) {
      var temp = []
      products.forEach(item => {
        temp.push(item)
      })
      setTimeout(() => {
        deleteAll()
        setIsLoadingRequest(0)
        setProductFillter(temp)
      }, 200)
    } else {
      var setFillter = new Set()
      var listFillter = []
      var flag = 0

      if (ramFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (ramFillter.find(e => e.value === item.idRam) !== undefined) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (ramFillter.find(e => e.value === item.idRam) !== undefined) {
              temp.push(item)
            }
          })
          listFillter = temp
        }
      }

      if (romFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (romFillter.find(e => e.value === item.idRom) !== undefined) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (romFillter.find(e => e.value === item.idRom) !== undefined) {
              temp.push(item)
            }
          })
          listFillter = temp
        }
      }

      if (displayFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (
                displayFillter.find(
                  e => e.value === item.kichThuoc
                ) !== undefined
              ) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (
              displayFillter.find(
                e => e.value === item.kichThuoc
              ) !== undefined
            ) {
              temp.push(item)
            }
          })
          listFillter = temp
        }
      }

      if (refreshRateFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (
                refreshRateFillter.find(
                  e => e.value === item.tanSoQuet
                ) !== undefined
              ) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (
              refreshRateFillter.find(
                e => e.value === item.tanSoQuet
              ) !== undefined
            ) {
              temp.push(item)
            }
          })
          listFillter = temp            
        }
      }

      if (danhMucFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (danhMucFillter.find(e => e.value === item.idDanhMuc) !== undefined) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (danhMucFillter.find(e => e.value === item.idDanhMuc) !== undefined) {
              temp.push(item)
            }
          })
          listFillter = temp            
        }
      }


      if (chipFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if (
                chipFillter.find(e => e.value === item.idChip) !==
                undefined
              ) {
                listFillter.push(item)
              }
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if (
              chipFillter.find(e => e.value === item.idChip) !==
              undefined
            ) {
              temp.push(item)
            }
          })
          listFillter = temp
        }
      }

      if (priceFillter.length !== 0) {
        if (listFillter.length === 0) {
          if (flag === 0) {
            flag++
            productDetails.forEach(item => {
              if(item.donGiaSauKhuyenMai === null || item.donGiaSauKhuyenMai === 0 || item.donGiaSauKhuyenMai === undefined){
                if (
                  priceFillter.find(
                    e => e.min <= item.donGia && item.donGia <= e.max
                  ) !== undefined
                ) {
                  listFillter.push(item)
                }
              }else{
                if (
                  priceFillter.find(
                    e => e.min <= item.donGiaSauKhuyenMai && item.donGiaSauKhuyenMai <= e.max
                  ) !== undefined
                ) {
                  listFillter.push(item)
                }
              }
             
            })
          }
        } else {
          var temp = []
          listFillter.forEach(item => {
            if(item.donGiaSauKhuyenMai === null){
              if (
                priceFillter.find(
                  e => e.min <= item.donGia && item.donGia <= e.max
                ) !== undefined
              ) {
                temp.push(item)
              }
            }else{
              if (
                priceFillter.find(
                  e => e.min <= item.donGiaSauKhuyenMai && item.donGiaSauKhuyenMai <= e.max
                ) !== undefined
              ) {
                temp.push(item)
              }
            }
          })
          listFillter = temp
        }
      }

      if (brandFillter === undefined) {
        console.log(brand)
        if (brand !== 'all') {
          if (listFillter.length === 0) {
            if (flag === 0) {
              flag++
              productDetails.forEach(item => {
                if (brand.toLowerCase() === item.tenHang.toLowerCase()) {
                  listFillter.push(item)
                }
              })
            }
          } else {
            var temp = []
            listFillter.forEach(item => {
              if (
                brand.toLowerCase() ===
                item.tenHang.toLowerCase()
              ) {
                temp.push(item)
              }
            })
            listFillter = temp
          }
        }
      }

      setTimeout(() => {
        setIsLoadingRequest(0)

        if (brandFillter !== undefined) {
          if (brandFillter !== 'all') {
            if (listFillter.length === 0) {
              if (flag === 0) {
                flag++
                productDetails.forEach(item => {
                  if (brandFillter.toLowerCase() === item.tenHang.toLowerCase()) {
                    listFillter.push(item)
                  }
                })
              }
            } else {
              var temp = []
              listFillter.forEach(item => {
                if (
                  brandFillter.toLowerCase() ===
                  item.tenHang.toLowerCase()
                ) {
                  temp.push(item)
                }
              })
              listFillter = temp
            }
          }
        }

        console.log(listFillter)
  
        listFillter.forEach(item => {
          setFillter.add(item.idSanPham)
        })
  
        listFillter = []
        products.forEach(item => {
          if (Array.from(setFillter).find(e => e === item.id)) {
            listFillter.push(item)
          }
        })
        setProductFillter(listFillter)
      }, 200)

    }
  }

  const deleteAll = () => {
    var prices = listPrice
    priceFillter.forEach(e => {
      if(e.label.indexOf("đến") === -1){
        prices.push(e)
      }else{
        setPriceZone({...priceZone,
        min: 0,
        max: priceBiggest
      })
    }})
    setpriceFillter([])
    setListPrice(prices)

    var danhmus = listDanhMuc
    danhMucFillter.forEach(e => {
      danhmus.push(e)
    })
    setDanhMucFillter([])
    setListDanhMuc(danhmus)

    var rams = listRam
    ramFillter.forEach(e => {
      rams.push(e)
    })
    setRamFillter([])
    setListRam(rams)

    var roms = listRom
    romFillter.forEach(e => {
      roms.push(e)
    })
    setRomFillter([])
    setlistRom(roms)

    var displays = listManHinh
    displayFillter.forEach(e => {
      displays.push(e)
    })
    setdisplayFillter([])
    setlistManHinh(displays)

    var tanSoQuets = listTanSoQuet
    refreshRateFillter.forEach(e => {
      tanSoQuets.push(e)
    })
    setRefreshRateFillter([])
    setListTanSoQuet(tanSoQuets)

    var chips = listChip
    chipFillter.forEach(e => {
      chips.push(e)
    })
    setChipFillter([])
    setlistChip(chips)
  }

  const formatMoney = number => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(number)
  }

  const sliderChange = e => {

    setPriceZone({...priceZone, 
      min: Number(e[0]),
      max: Number(e[1])
    })
    var result  = []
    result.push({
      label: `Từ ${formatMoney(e[0])} đến ${formatMoney(e[1])}`,
      min: e[0],
      max: e[1]
    })
    setpriceFillter(result)
   
  }

  return (
    <>
    {
      Number(isLoadingRequest) === 0 ? 
       <> </>
      :
        <div className='custom-spin'>
         <Spin indicator={<LoadingOutlined style={{ fontSize: 40, color: '#126de4', marginLeft: 5 }} spin />} />
        </div>
      
    }
    <div className='cat-products'>
      <div className='container'>
        <div
          className='card bg-white'
          style={{
            padding: ` 2% 3%`,
            width: '100%',
            marginTop: 80,
            borderRadius: '10px'
          }}
        >
          <div style={{ marginBottom: `10px`, marginTop: 5 }}>
            {' '}
            <span
              className='text-capitalize'
              style={{
                color: 'black',
                fontSize: 20,
                fontWeight: 700,
                position: `relative`
              }}
            >
              Điện thoại
            </span>
          </div>

          {/* <div style={{ marginBottom: `10px` }}>
            {' '}
            <span
              className='text-capitalize'
              style={{
                color: 'black',
                fontSize: 14,
                fontWeight: 700,
                position: `relative`
              }}
            >
              Hãng sản xuất
            </span>
          </div> */}

          {/* <div style={{ marginBottom: `0px`, display: 'flex' }}>
            {listLogos.map(item => {
              return (
                <div
                  style={
                    item.value === brand
                      ? selectSelected()
                      : selectNotSelected()
                  }
                  onClick={() => {
                    var data = [
                      {
                        path: '/products/all',
                        name: 'Điện thoại'
                      },
                      {
                        path: `/products/${item.value}`,
                        name: item.value
                      }
                    ]
                    dispatch(AddItemNavbar(data))
                    setBrandFillter(item.value)
                    navigate(`/products/${item.value}`)
                    searchProductsAll(item.value)
                  }}
                >
                  <img src={item.url} style={{ width: '38%' }} />
                </div>
              )
            })}
          </div> */}

          <div style={{ marginBottom: `10px` }}>
            {' '}
            <span
              className='text-capitalize'
              style={{
                color: 'black',
                fontSize: 14,
                fontWeight: 700,
                position: `relative`
              }}
            >
              Lọc theo
            </span>
          </div>

          <div
            style={{ marginBottom: `0px`, display: 'flex', flexWrap: 'wrap' }}
          >
            <button
              style={
                ramFillter.length === 0 &&
                chipFillter.length === 0 &&
                priceFillter.length === 0 &&
                danhMucFillter.length === 0 &&
                romFillter.length === 0 &&
                displayFillter.length === 0 &&
                refreshRateFillter.length === 0
                  ? selectNotSelected()
                  : selectSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 1) {
                    setShowFilter(0)
                  } else setShowFilter(1)
                  window.scrollTo(0, 175)
                }}
              >
                <i class='fa fa-filter' style={{ margin: `0 5px 0px ` }}></i>
                Bộ lọc
                {ramFillter.length === 0 &&
                chipFillter.length === 0 &&
                priceFillter.length === 0 &&
                danhMucFillter.length === 0 &&
                romFillter.length === 0 &&
                displayFillter.length === 0 &&
                refreshRateFillter.length === 0 ? (
                  <></>
                ) : (
                  <div
                    style={{
                      width: 15,
                      height: 15,
                      background: 'rgb(18, 141, 226)',
                      position: 'absolute',
                      top: `-7px`,
                      right: `-6px`,
                      borderRadius: `50%`,
                      fontSize: `8px`,
                      color: `#fff`,
                      textAlign: `center`,
                      fontWeight: '800',
                      lineHeight: '15px'
                    }}
                  >
                    {chipFillter.length +
                      ramFillter.length +
                      priceFillter.length +
                      danhMucFillter.length +
                      romFillter.length +
                      displayFillter.length +
                      refreshRateFillter.length}
                  </div>
                )}
              </div>
              {showFilter === 1 ? (
                <>
                  <div
                    className='list-filter'
                    style={{ width: 800, height: `400px` }}
                  >
                    {ramFillter.length === 0 &&
                    chipFillter.length === 0 &&
                    priceFillter.length === 0 &&
                    danhMucFillter.length === 0 &&
                    romFillter.length === 0 &&
                    displayFillter.length === 0 &&
                    refreshRateFillter.length === 0 ? (
                      <></>
                    ) : (
                      <div
                        style={{
                          width: '100%'
                        }}
                      >
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => deleteAll()}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>

                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            height: 88,
                            overflowY: 'scroll'
                          }}
                        >
                          {danhMucFillter.map(item => {
                            return (
                              <button
                                style={itemSelected()}
                                onClick={() => {
                                  var danhMucSelected = danhMucFillter
                                  var danhmucs = listDanhMuc
                                  if (checkDanhMuc(item)) {
                                    danhMucSelected = danhMucSelected.filter(
                                      ram => ram.value !== item.value
                                    )
                                    danhmucs[danhmucs.length] = item
                                  } else {
                                    danhMucSelected[danhMucFillter.length] =
                                      item
                                    danhmucs = danhmucs.filter(
                                      ram => ram.value !== item.value
                                    )
                                  }
                                  setDanhMucFillter(danhMucSelected)
                                  setListDanhMuc(danhmucs)
                                }}
                              >
                                {item.label}
                                <i
                                  class='fa fa-times'
                                  style={{
                                    marginLeft: '5px',
                                    fontWeight: 'bolder',
                                    fontSize: 17,
                                    color: '#128DE2'
                                  }}
                                ></i>
                              </button>
                            )
                          })}

                          {/* gia ca */}
                          {priceFillter.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              {priceFillter.map(item => {
                                return (
                                  <button
                                    style={itemSelected()}
                                    onClick={() => {
                                      var priceSelect = priceFillter
                                      var prices = listPrice
                                      if (checkPrice(item)) {
                                        priceSelect = priceSelect.filter(
                                          ram => ram.min !== item.min
                                        )
                                        prices[prices.length] = item
                                      } else {
                                        priceSelect[priceFillter.length] = item
                                        prices = prices.filter(
                                          ram => ram.min !== item.min
                                        )
                                      }
                                      setpriceFillter(priceSelect)
                                      setListPrice(prices)
                                    }}
                                  >
                                    {item.label}
                                    <i
                                      class='fa fa-times'
                                      style={{
                                        marginLeft: '5px',
                                        fontWeight: 'bolder',
                                        fontSize: 17,
                                        color: '#128DE2'
                                      }}
                                    ></i>
                                  </button>
                                )
                              })}
                            </>
                          )}

                          {/* ram */}

                          {ramFillter.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              {ramFillter.map(item => {
                                return (
                                  <button
                                    style={itemSelected()}
                                    onClick={() => {
                                      var ramSelect = ramFillter
                                      var rams = listRam
                                      if (checkRam(item)) {
                                        ramSelect = ramSelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        rams[rams.length] = item
                                      } else {
                                        ramSelect[ramFillter.length] = item
                                        rams = rams.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setRamFillter(ramSelect)
                                      setListRam(rams)
                                    }}
                                  >
                                    {item.label}
                                    <i
                                      class='fa fa-times'
                                      style={{
                                        marginLeft: '5px',
                                        fontWeight: 'bolder',
                                        fontSize: 17,
                                        color: '#128DE2'
                                      }}
                                    ></i>
                                  </button>
                                )
                              })}
                            </>
                          )}
                          {/* rom */}
                          {romFillter.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              {romFillter.map(item => {
                                return (
                                  <button
                                    style={itemSelected()}
                                    onClick={() => {
                                      var romSelect = romFillter
                                      var roms = listRom
                                      if (checkRom(item)) {
                                        romSelect = romSelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        roms[roms.length] = item
                                      } else {
                                        romSelect[romFillter.length] = item
                                        roms = roms.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setRomFillter(romSelect)
                                      setlistRom(roms)
                                    }}
                                  >
                                    {item.label}
                                    <i
                                      class='fa fa-times'
                                      style={{
                                        marginLeft: '5px',
                                        fontWeight: 'bolder',
                                        fontSize: 17,
                                        color: '#128DE2'
                                      }}
                                    ></i>
                                  </button>
                                )
                              })}
                            </>
                          )}
                          {/* display */}

                          {displayFillter.map(item => {
                            return (
                              <button
                                style={itemSelected()}
                                onClick={() => {
                                  var displaySelect = displayFillter
                                  var displays = listManHinh
                                  if (checkDisplay(item)) {
                                    displaySelect = displaySelect.filter(
                                      ram => ram.value !== item.value
                                    )
                                    displays[displays.length] = item
                                  } else {
                                    displaySelect[displayFillter.length] = item
                                    displays = displays.filter(
                                      ram => ram.value !== item.value
                                    )
                                  }
                                  setdisplayFillter(displaySelect)
                                  setlistManHinh(displays)
                                }}
                              >
                                {item.label}
                                <i
                                  class='fa fa-times'
                                  style={{
                                    marginLeft: '5px',
                                    fontWeight: 'bolder',
                                    fontSize: 17,
                                    color: '#128DE2'
                                  }}
                                ></i>
                              </button>
                            )
                          })}
                          {/* refresh rate */}
                          {refreshRateFillter.map(item => {
                            return (
                              <button
                                style={itemSelected()}
                                onClick={() => {
                                  var refreshRateSelect = refreshRateFillter
                                  var refreshRates = listTanSoQuet
                                  if (checkTanSoQuet(item)) {
                                    refreshRateSelect =
                                      refreshRateSelect.filter(
                                        ram => ram.value !== item.value
                                      )
                                    refreshRates[refreshRates.length] = item
                                  } else {
                                    refreshRateSelect[
                                      refreshRateSelect.length
                                    ] = item
                                    refreshRates = refreshRates.filter(
                                      ram => ram.value !== item.value
                                    )
                                  }
                                  setRefreshRateFillter(refreshRateSelect)
                                  setListTanSoQuet(refreshRates)
                                }}
                              >
                                {item.label}
                                <i
                                  class='fa fa-times'
                                  style={{
                                    marginLeft: '5px',
                                    fontWeight: 'bolder',
                                    fontSize: 17,
                                    color: '#128DE2'
                                  }}
                                ></i>
                              </button>
                            )
                          })}

                          {chipFillter.map(item => {
                            return (
                              <button
                                style={itemSelected()}
                                onClick={() => {
                                  var chipSelect = chipFillter
                                  var chips = listChip
                                  if (checkChip(item)) {
                                    chipSelect = chipSelect.filter(
                                      ram => ram.value !== item.value
                                    )
                                    chips[chips.length] = item
                                  } else {
                                    chipSelect[chipSelect.length] = item
                                    chips = chips.filter(
                                      ram => ram.value !== item.value
                                    )
                                  }
                                  setChipFillter(chipSelect)
                                  setlistChip(chips)
                                }}
                              >
                                {item.label}
                                <i
                                  class='fa fa-times'
                                  style={{
                                    marginLeft: '5px',
                                    fontWeight: 'bolder',
                                    fontSize: 17,
                                    color: '#128DE2'
                                  }}
                                ></i>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div
                      style={
                        ramFillter.length === 0 &&
                        chipFillter.length === 0 &&
                        priceFillter.length === 0 &&
                        danhMucFillter.length === 0 &&
                        romFillter.length === 0 &&
                        displayFillter.length === 0 &&
                        refreshRateFillter.length === 0
                          ? overFlowNoItemCss()
                          : overFlowHasItemCss()
                      }
                    >
                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listPrice.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Mức giá
                              </span>
                              {listPrice.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var priceSelect = priceFillter
                                      var prices = listPrice
                                      if (checkPrice(item)) {
                                        priceSelect = priceSelect.filter(
                                          ram => ram.min !== item.min
                                        )
                                        prices[prices.length] = item
                                      } else {
                                        priceSelect[priceFillter.length] = item
                                        prices = prices.filter(
                                          ram => ram.min !== item.min
                                        )
                                      }
                                      setpriceFillter(priceSelect)
                                      setListPrice(prices)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                                 <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Lựa chọn khoảng giá
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                          
                              <button
                                style={itemNotSelected()}
                              >
                                {priceZone.min == ""
                                  ? "0".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                                  : priceZone.min
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                              </button>
                              
                              <button
                                style={itemNotSelected()}
                              >
                                {priceZone.max == ""
                                  ? priceBiggest
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                                  : priceZone.max 
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                              </button>
                              </div>
                                <div style={{ display: 'flex', with: '100%'}}>
                                  {
                                    priceZone.min === 0 && priceZone.max === priceBiggest ? <>
                                    <Slider
                                      onChange={(e) => sliderChange(e)}
                                      style={{ width: '232px', marginLeft: 10, marginBottom: 20 }}
                                      min={0}
                                      max={Number(priceBiggest)}
                                      step={100000}
                                      range
                                      defaultValue={[0,Number(priceBiggest)]}
                                    />
                                    </> :
                                    <Slider
                                    onChange={(e) => sliderChange(e)}
                                    style={{ width: '232px', marginLeft: 10, marginBottom: 20 }}
                                    min={0}
                                    max={Number(priceBiggest)}
                                    step={100000}
                                    range
                                    defaultValue={[priceZone.min, Number(priceZone.max)]}
                                  />
                                  }
                                  
                                  
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listDanhMuc.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Nhu cầu sử dụng
                              </span>
                              {listDanhMuc.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var danhMucSelected = danhMucFillter
                                      var danhmucs = listDanhMuc
                                      if (checkDanhMuc(item)) {
                                        danhMucSelected =
                                          danhMucSelected.filter(
                                            ram => ram.value !== item.value
                                          )
                                        danhmucs[danhmucs.length] = item
                                      } else {
                                        danhMucSelected[danhMucFillter.length] =
                                          item
                                        danhmucs = danhmucs.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setDanhMucFillter(danhMucSelected)
                                      setListDanhMuc(danhmucs)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listRam.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Ram
                              </span>
                              {listRam.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var ramSelect = ramFillter
                                      var rams = listRam
                                      if (checkRam(item)) {
                                        ramSelect = ramSelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        rams[rams.length] = item
                                      } else {
                                        ramSelect[ramFillter.length] = item
                                        rams = rams.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setRamFillter(ramSelect)
                                      setListRam(rams)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listRom.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Bộ nhớ trong
                              </span>
                              {listRom.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var romSelect = romFillter
                                      var roms = listRom
                                      if (checkRom(item)) {
                                        romSelect = romSelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        roms[roms.length] = item
                                      } else {
                                        romSelect[romFillter.length] = item
                                        roms = roms.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setRomFillter(romSelect)
                                      setlistRom(roms)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listManHinh.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Kích thước màn hình
                              </span>
                              {listManHinh.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var displaySelect = displayFillter
                                      var displays = listManHinh
                                      if (checkDisplay(item)) {
                                        displaySelect = displaySelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        displays[displays.length] = item
                                      } else {
                                        displaySelect[displayFillter.length] =
                                          item
                                        displays = displays.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setdisplayFillter(displaySelect)
                                      setlistManHinh(displays)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listTanSoQuet.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Tần số quét
                              </span>
                              {listTanSoQuet.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var refreshRateSelect = refreshRateFillter
                                      var refreshRates = listTanSoQuet
                                      if (checkTanSoQuet(item)) {
                                        refreshRateSelect =
                                          refreshRateSelect.filter(
                                            ram => ram.value !== item.value
                                          )
                                        refreshRates[refreshRates.length] = item
                                      } else {
                                        refreshRateSelect[
                                          refreshRateSelect.length
                                        ] = item
                                        refreshRates = refreshRates.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setRefreshRateFillter(refreshRateSelect)
                                      setListTanSoQuet(refreshRates)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>

                      <div style={{ width: '33.3333333333%' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                          {listChip.length === 0 ? (
                            <></>
                          ) : (
                            <>
                              <span
                                style={{
                                  fontWeight: '700',
                                  marginLeft: '2px',
                                  marginTop: '10px',
                                  marginBottom: '10px',
                                  display: 'block',
                                  textAlign: 'left',
                                  width: '100%'
                                }}
                              >
                                Chip
                              </span>
                              {listChip.map(item => {
                                return (
                                  <button
                                    style={itemNotSelected()}
                                    onClick={() => {
                                      var chipSelect = chipFillter
                                      var chips = listChip
                                      if (checkChip(item)) {
                                        chipSelect = chipSelect.filter(
                                          ram => ram.value !== item.value
                                        )
                                        chips[chips.length] = item
                                      } else {
                                        chipSelect[chipSelect.length] = item
                                        chips = chips.filter(
                                          ram => ram.value !== item.value
                                        )
                                      }
                                      setChipFillter(chipSelect)
                                      setlistChip(chips)
                                    }}
                                  >
                                    {item.label}
                                  </button>
                                )
                              })}
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
            </button>

            <button
              style={
                priceFillter.length === 0
                  ? selectNotSelected()
                  : selectSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 2) {
                    setShowFilter(0)
                  } else setShowFilter(2)
                  window.scrollTo(0, 175)
                }}
              >
                Mức giá
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 2 ? (
                <>
                  <div className='list-filter'>
                    {priceFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listPrice
                              priceFillter.forEach(e => {
                                if(e.label.indexOf("đến") === -1){
                                  rams.push(e)
                                }else{
                                  setPriceZone({...priceZone,
                                  min: 0,
                                  max: priceBiggest
                                })
                                
                            }})
                              setpriceFillter([])
                              setListPrice(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {priceFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var priceSelect = priceFillter
                                var prices = listPrice
                                if (checkPrice(item)) {
                                  priceSelect = priceSelect.filter(
                                    ram => ram.min !== item.min
                                  )
                                  if(item.label.indexOf("đến") === -1){
                                    prices[prices.length] = item
                                  }else{
                                    setPriceZone({...priceZone,
                                    min: 0,
                                    max: priceBiggest
                                  })
                                  }
                                  
                                } else {
                                  priceSelect[priceFillter.length] = item
                                  prices = prices.filter(
                                    ram => ram.min !== item.min
                                  )
                                }
                                setpriceFillter(priceSelect)
                                setListPrice(prices)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                       
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listPrice.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách mức giá
                        </span>
                        {listPrice.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var priceSelect = priceFillter
                                var prices = listPrice
                                if (checkPrice(item)) {
                                  priceSelect = priceSelect.filter(
                                    ram => ram.min !== item.min
                                  )
                                  prices[prices.length] = item
                                } else {
                                  priceSelect[priceFillter.length] = item
                                  prices = prices.filter(
                                    ram => ram.min !== item.min
                                  )
                                }
                                setpriceFillter(priceSelect)
                                setListPrice(prices)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                           <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Lựa chọn khoảng giá
                        </span>

                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                          
                              <button
                                style={itemNotSelected()}
                              >
                                {priceZone.min == ""
                                  ? "0".toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                                  : priceZone.min
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                              </button>
                              
                              <button
                                style={itemNotSelected()}
                              >
                                {priceZone.max == ""
                                  ? priceBiggest
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"
                                  : priceZone.max 
                                      .toString()
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ"}
                              </button>
                         </div>
                           <div style={{ display: 'flex', with: '100%'}}>
                            {
                              priceZone.min === 0 && priceZone.max === priceBiggest ? <>
                               <Slider
                                onChange={(e) => sliderChange(e)}
                                style={{ width: '296px', marginLeft: 10, marginBottom: 20 }}
                                min={0}
                                max={Number(priceBiggest)}
                                step={100000}
                                range
                                defaultValue={[0,Number(priceBiggest)]}
                              />
                              </> :
                              <Slider
                              onChange={(e) => sliderChange(e)}
                              style={{ width: '296px', marginLeft: 10, marginBottom: 20 }}
                              min={0}
                              max={Number(priceBiggest)}
                              step={100000}
                              range
                              defaultValue={[priceZone.min, Number(priceZone.max)]}
                            />
                            }
                             
                             
                         </div>
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                danhMucFillter.length === 0
                  ? selectNotSelected()
                  : selectSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 6) {
                    setShowFilter(0)
                  } else setShowFilter(6)
                  window.scrollTo(0, 175)
                }}
              >
                Nhu cầu sử dụng
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 6 ? (
                <>
                  <div className='list-filter'>
                    {danhMucFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listDanhMuc
                              danhMucFillter.forEach(e => {
                                rams.push(e)
                              })
                              setDanhMucFillter([])
                              setListDanhMuc(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {danhMucFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var danhMucSelected = danhMucFillter
                                var danhmucs = listDanhMuc
                                if (checkDanhMuc(item)) {
                                  danhMucSelected = danhMucSelected.filter(
                                    ram => ram.value !== item.value
                                  )
                                  danhmucs[danhmucs.length] = item
                                } else {
                                  danhMucSelected[danhMucFillter.length] = item
                                  danhmucs = danhmucs.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setDanhMucFillter(danhMucSelected)
                                setListDanhMuc(danhmucs)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listDanhMuc.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách nhu cầu
                        </span>
                        {listDanhMuc.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var danhMucSelected = danhMucFillter
                                var danhmucs = listDanhMuc
                                if (checkDanhMuc(item)) {
                                  danhMucSelected = danhMucSelected.filter(
                                    ram => ram.value !== item.value
                                  )
                                  danhmucs[danhmucs.length] = item
                                } else {
                                  danhMucSelected[danhMucFillter.length] = item
                                  danhmucs = danhmucs.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setDanhMucFillter(danhMucSelected)
                                setListDanhMuc(danhmucs)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                ramFillter.length !== 0 ? selectSelected() : selectNotSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 7) {
                    setShowFilter(0)
                  } else setShowFilter(7)
                  window.scrollTo(0, 175)
                }}
              >
                Dung lượng RAM
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 7 ? (
                <>
                  <div className='list-filter'>
                    {ramFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listRam
                              ramFillter.forEach(e => {
                                rams.push(e)
                              })
                              setRamFillter([])
                              setListRam(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {ramFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var ramSelect = ramFillter
                                var rams = listRam
                                if (checkRam(item)) {
                                  ramSelect = ramSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  rams[rams.length] = item
                                } else {
                                  ramSelect[ramFillter.length] = item
                                  rams = rams.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRamFillter(ramSelect)
                                setListRam(rams)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listRam.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách ram
                        </span>
                        {listRam.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var ramSelect = ramFillter
                                var rams = listRam
                                if (checkRam(item)) {
                                  ramSelect = ramSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  rams[rams.length] = item
                                } else {
                                  ramSelect[ramFillter.length] = item
                                  rams = rams.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRamFillter(ramSelect)
                                setListRam(rams)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                romFillter.length !== 0 ? selectSelected() : selectNotSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 8) {
                    setShowFilter(0)
                  } else setShowFilter(8)
                  window.scrollTo(0, 175)
                }}
              >
                Bộ nhớ trong
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 8 ? (
                <>
                  <div className='list-filter'>
                    {romFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listRom
                              romFillter.forEach(e => {
                                rams.push(e)
                              })
                              setRomFillter([])
                              setlistRom(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {romFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var romSelect = romFillter
                                var roms = listRom
                                if (checkRom(item)) {
                                  romSelect = romSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  roms[roms.length] = item
                                } else {
                                  romSelect[romFillter.length] = item
                                  roms = roms.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRomFillter(romSelect)
                                setlistRom(roms)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listRom.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách rom
                        </span>
                        {listRom.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var romSelect = romFillter
                                var roms = listRom
                                if (checkRom(item)) {
                                  romSelect = romSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  roms[roms.length] = item
                                } else {
                                  romSelect[romFillter.length] = item
                                  roms = roms.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRomFillter(romSelect)
                                setlistRom(roms)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                displayFillter.length !== 0
                  ? selectSelected()
                  : selectNotSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 9) {
                    setShowFilter(0)
                  } else setShowFilter(9)
                  window.scrollTo(0, 175)
                }}
              >
                Kích thước màn hình
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 9 ? (
                <>
                  <div className='list-filter'>
                    {displayFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listManHinh
                              displayFillter.forEach(e => {
                                rams.push(e)
                              })
                              setdisplayFillter([])
                              setlistManHinh(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {displayFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var displaySelect = displayFillter
                                var displays = listManHinh
                                if (checkDisplay(item)) {
                                  displaySelect = displaySelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  displays[displays.length] = item
                                } else {
                                  displaySelect[displayFillter.length] = item
                                  displays = displays.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setdisplayFillter(displaySelect)
                                setlistManHinh(displays)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listManHinh.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách kích thước màn hình
                        </span>
                        {listManHinh.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var displaySelect = displayFillter
                                var displays = listManHinh
                                if (checkDisplay(item)) {
                                  displaySelect = displaySelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  displays[displays.length] = item
                                } else {
                                  displaySelect[displayFillter.length] = item
                                  displays = displays.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setdisplayFillter(displaySelect)
                                setlistManHinh(displays)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                refreshRateFillter.length !== 0
                  ? selectSelected()
                  : selectNotSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 10) {
                    setShowFilter(0)
                  } else setShowFilter(10)
                  window.scrollTo(0, 175)
                }}
              >
                Tần số quét
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 10 ? (
                <>
                  <div className='list-filter'>
                    {refreshRateFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listTanSoQuet
                              refreshRateFillter.forEach(e => {
                                rams.push(e)
                              })
                              setRefreshRateFillter([])
                              setListTanSoQuet(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {refreshRateFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var refreshRateSelect = refreshRateFillter
                                var refreshRates = listTanSoQuet
                                if (checkTanSoQuet(item)) {
                                  refreshRateSelect = refreshRateSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  refreshRates[refreshRates.length] = item
                                } else {
                                  refreshRateSelect[refreshRateSelect.length] =
                                    item
                                  refreshRates = refreshRates.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRefreshRateFillter(refreshRateSelect)
                                setListTanSoQuet(refreshRates)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listTanSoQuet.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách tần số quét
                        </span>
                        {listTanSoQuet.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var refreshRateSelect = refreshRateFillter
                                var refreshRates = listTanSoQuet
                                if (checkTanSoQuet(item)) {
                                  refreshRateSelect = refreshRateSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  refreshRates[refreshRates.length] = item
                                } else {
                                  refreshRateSelect[refreshRateSelect.length] =
                                    item
                                  refreshRates = refreshRates.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setRefreshRateFillter(refreshRateSelect)
                                setListTanSoQuet(refreshRates)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>

            <button
              style={
                chipFillter.length !== 0
                  ? selectSelected()
                  : selectNotSelected()
              }
            >
              <div
                onClick={() => {
                  if (showFilter === 11) {
                    setShowFilter(0)
                  } else setShowFilter(11)
                  window.scrollTo(0, 175)
                }}
              >
                Chip xử lí
                <i
                  class='fa fa-caret-down'
                  style={{ margin: `0 5px 0px ` }}
                ></i>
              </div>
              {showFilter === 11 ? (
                <>
                  <div className='list-filter'>
                    {chipFillter.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Đã chọn
                          <span
                            style={{
                              fontWeight: `400`,
                              textAlign: `right`,
                              float: `right`
                            }}
                            onClick={() => {
                              var rams = listChip
                              chipFillter.forEach(e => {
                                rams.push(e)
                              })
                              setChipFillter([])
                              setlistChip(rams)
                            }}
                          >
                            <i class='fa fa-trash'></i> Xoá tất cả
                          </span>
                        </span>
                        {chipFillter.map(item => {
                          return (
                            <button
                              style={itemSelected()}
                              onClick={() => {
                                var chipSelect = chipFillter
                                var chips = listChip
                                if (checkChip(item)) {
                                  chipSelect = chipSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  chips[chips.length] = item
                                } else {
                                  chipSelect[chipSelect.length] = item
                                  chips = chips.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setChipFillter(chipSelect)
                                setlistChip(chips)
                              }}
                            >
                              {item.label}
                              <i
                                class='fa fa-times'
                                style={{
                                  marginLeft: '5px',
                                  fontWeight: 'bolder',
                                  fontSize: 17,
                                  color: '#128DE2'
                                }}
                              ></i>
                            </button>
                          )
                        })}
                        <div style={{ width: '100%' }}></div>
                      </>
                    )}

                    {listChip.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <span
                          style={{
                            fontWeight: '700',
                            marginLeft: '2px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            display: 'block',
                            textAlign: 'left',
                            width: '100%'
                          }}
                        >
                          Danh sách chip
                        </span>
                        {listChip.map(item => {
                          return (
                            <button
                              style={itemNotSelected()}
                              onClick={() => {
                                var chipSelect = chipFillter
                                var chips = listChip
                                if (checkChip(item)) {
                                  chipSelect = chipSelect.filter(
                                    ram => ram.value !== item.value
                                  )
                                  chips[chips.length] = item
                                } else {
                                  chipSelect[chipSelect.length] = item
                                  chips = chips.filter(
                                    ram => ram.value !== item.value
                                  )
                                }
                                setChipFillter(chipSelect)
                                setlistChip(chips)
                              }}
                            >
                              {item.label}
                            </button>
                          )
                        })}
                      </>
                    )}

                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        height: '40px',
                        marginBottom: '10px'
                      }}
                    >
                      <Button
                        variant='contained'
                        style={{
                          width: '100%',
                          borderRadius: '0px',
                          fontSize: 14,
                          fontWeight: 600,
                          textTransform: `capitalize`
                        }}
                        onClick={() => resultSearch()}
                      >
                        Xem kết quả
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='list-filter-hidden'></div>
                </>
              )}
            </button>
          </div>

          <div className='cat-products-content' style={{ width: '100%' }}>
            {categoryProductsStatus === STATUS.LOADING ? (
              <Loader />
            ) : productFillter.length === 0 ? (
              <>
                <Empty
                  description={
                    'Không có sản phẩm nào phù hợp với tiêu chí bạn tìm :(('
                  }
                />
              </>
            ) : (
              <ProductListNormal products={productFillter} />
            )}
          </div>

        </div>
      </div>
          <br/>
          <br/>
          <br/>
    </div>

    </>
  )
}

export default CategoryProductPage
