import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import classes from './Products.module.css';

const Products = (props) => {

  const products = useSelector(state => state.products);
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {
          products.map(product => (<ProductItem
            key={product.title}
            title={product.title}
            price={product.price}
            description={product.description}
          />))
        }
      </ul>
    </section>
  );
};

export default Products;
