import classes from './CartButton.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { uiActions } from '../../store';

const CartButton = (props) => {
  const dispatch = useDispatch();
  const cartHandler = () => {
    dispatch(uiActions.showOrHideCart());
  }
  const badge = useSelector(state => state.cart.numberOfItems)
  return (
    <button onClick={cartHandler} className={classes.button}>
      <span>My Cart</span>
      <span className={classes.badge}>{badge}</span>
    </button>
  );
};

export default CartButton;
