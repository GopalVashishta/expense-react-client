const ProductList = ({ products }) => {
  return (
    <>  
        {/* products is an array of objects with id, name, price, and category */}
      <h2>Product List</h2>
      {products.map((product) => (
          <p key={product.id}>
            {product.name} <br />
            {product.price}
            <br /> <br />
          </p>
      ))}

    </>
  );
}

export default ProductList;