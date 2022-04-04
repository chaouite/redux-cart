import { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import { useDispatch } from 'react-redux';
import Notification from './components/UI/Notification';
import { sendCartData, fetchCartData } from './store/index';


let initial = true;
function App() {
  const dispatch = useDispatch();

  const showCart = useSelector(state => state.ui.isShown);
  const cart = useSelector(state => state.cart);
  const notification = useSelector(state => state.ui.notification);

  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  useEffect(() => {
    if (initial) {
      initial = false;
      return;
    }
    if (cart.changed) {
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);
  return (
    <Fragment>
      {notification &&
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      }
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>

  );
}

export default App;
