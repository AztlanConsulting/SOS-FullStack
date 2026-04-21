import { useLocation } from 'react-router';

const ProductDetail = () => {
  const { state } = useLocation();
  console.log(state);

  return <div>ProductDetail</div>;
};

export default ProductDetail;
