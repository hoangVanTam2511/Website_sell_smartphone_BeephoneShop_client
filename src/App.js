import './App.scss'
// react router v6
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// pages
import {
  Home,
  CategoryProduct,
  ProductSingle,
  Cart,
  Search,
  LoginPage,
  SearchOrderPage,
  CheckoutPage,
  LookUpOrderPage,
  OrderDetail,
  Page403,
  VnPayPayment
} from './pages/index'
// components
import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import Footer from './components/Footer/Footer'
import store from './store/store'
import { Provider } from 'react-redux'

function App () {
  return (
    <div className='App'>
      <Provider store={store}>
        <BrowserRouter>
          <Header />
          <Sidebar />
          <div style={{ height: '90px' }}></div>

          <Routes>
            {/* home page route */}
            <Route path='/' element={<Home />} />
            {/* single product route */}
            <Route path='/product/:id' element={<ProductSingle />} />
            {/* category wise product listing route */}
            <Route path='/products/:brand' element={<CategoryProduct />} />
            {/* cart */}
            <Route path='/cart' element={<Cart />} />
            {/* searched products */}
            <Route path='/search/:searchTerm' element={<Search />} />
            {/* login page */}
            <Route path='/login' element={<LoginPage />} />
            {/* search order by phone number page */}
            <Route path='/search-order-page' element={<SearchOrderPage />} />
            {/* check out */}
            <Route path='/check-out' element={<CheckoutPage />} />
            {/* look up order page */}
            <Route path='/look-up-order-page/:id_bill' element={<LookUpOrderPage />} />
            {/* look up order page */}
            <Route path='/order-detail/:id' element={<OrderDetail />} />
             {/* vnpay */}
             <Route path='/payment-success' element={<VnPayPayment />} />
            

            {/* look up order page */}
            <Route path='/403-not-found' element={<Page403 />} />
          </Routes>

          <Footer />
        </BrowserRouter>

        
      </Provider>
    </div>
  )
}

export default App
