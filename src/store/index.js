import { configureStore, createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    numberOfItems: 0,
    changed: false,
  },
  reducers: {
    replaceCart(state, action) {
      state.numberOfItems = action.payload.numberOfItems;
      state.items = action.payload.items;
    },
    addToCart(state, action) {
      state.changed = true;
      state.numberOfItems++;
      const existingItem = state.items.find(
        item => item.title === action.payload.title);
      if (existingItem) {
        existingItem.quantity++;
        existingItem.total = existingItem.quantity * existingItem.price;
      }
      else {
        state.items.push({
          title: action.payload.title,
          quantity: 1,
          total: action.payload.price,
          price: action.payload.price,
        });
      }
    },
    removeFromCart(state, action) {
      state.changed = true;
      const itemToRemove = state.items.find(
        item => item.title === action.payload.title);
      state.numberOfItems--;
      if (itemToRemove.quantity === 1) {
        state.items = state.items.filter(item => item.title !== itemToRemove.title)
      }
      else {
        itemToRemove.quantity--;
        itemToRemove.total = itemToRemove.quantity * itemToRemove.price;
      }
    }
  }
}
);
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isShown: false,
    notification: null,
  },
  reducers: {
    showOrHideCart(state) {
      state.isShown = !state.isShown;
    },
    showNotification(state, action) {
      state.notification = {
        status: action.payload.status,
        title: action.payload.title,
        message: action.payload.message,
      }
    }
  }
});
export const uiActions = uiSlice.actions;
export const cartActions = cartSlice.actions;
const productsSlice = createSlice({
  name: 'products',
  initialState: [
    {
      title: 'PC',
      price: 1000,
      description: 'Macbook pro 16 inch i9 - 2,6 Hz'
    },
    {
      title: 'CAR',
      price: 20000,
      description: 'FORD RAM F 1500 - 2022'
    }
  ],
  reducers: {

  }
});

const store = configureStore({
  reducer:
  {
    cart: cartSlice.reducer,
    products: productsSlice.reducer,
    ui: uiSlice.reducer,
  }
});

export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification(
      {
        status: 'pending',
        title: 'Sending...',
        message: 'Sending cart s data!'
      }
    ));
    const sendData = async () => {
      const response = await fetch('https://cart-d3375-default-rtdb.firebaseio.com/cart.json',
        {
          method: 'PUT',
          body: JSON.stringify(cart),
        });
      if (!response.ok) {
        throw new Error('Something went wrong!!!')
      }
      dispatch(uiActions.showNotification(
        {
          status: 'success',
          title: 'Successfully',
          message: 'Cart s data were sent successfully!'
        }
      ))
    }
    try {
      await sendData();
    } catch (error) {
      dispatch(uiActions.showNotification(
        {
          status: 'error',
          title: 'Error',
          message: 'Sending cart s data failed!'
        }
      ))
    }
  }
};

export const fetchCartData = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch('https://cart-d3375-default-rtdb.firebaseio.com/cart.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const cartData = await response.json();
      return cartData;
    }
    try {
      const data = await fetchData();
      dispatch(cartActions.replaceCart({
        items: data.items || [],
        numberOfItems: data.numberOfItems,
      }));

    } catch (error) {
      dispatch(uiActions.showNotification({
        status: 'error',
        title: 'Error',
        message: 'Fetching cart s data failed!'
      }))
    }
  }
}

export default store;