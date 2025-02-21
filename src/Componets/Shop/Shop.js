import React, { useEffect, useState } from 'react';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import {addToDb, } from '../../utilities/fakedb'
import './Shop.css';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';


const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useCart();
    const [page, setPage] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    // products to be rendered on the UI
    const [displayProducts, setDisplayProducts] = useState([]);
    const size = 10;
    useEffect(() => {
        fetch(`http://localhost:5000/products?page=${page}&&size=${size}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data.products);
                setDisplayProducts(data.products);
                const count = data.count;
                const pageNumber = Math.ceil(count / size);
                setPageCount(pageNumber);
            });
    }, [page]);



    const handleAddToCart = (product) => {
        const exists = cart.find(pd => pd.key === product.key);
        let newCart = [];
        if (exists) {
            const rest = cart.filter(pd => pd.key !== product.key);
            exists.quantity = exists.quantity + 1;
            newCart = [...rest, product];
        }
        else {
            product.quantity = 1;
            newCart = [...cart, product];
        }
        setCart(newCart);
        // save to local storage (for now)
        addToDb(product.key);

    }

    const handleSearch = event => {
        const searchText = event.target.value;

        const matchedProducts = products.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));

        setDisplayProducts(matchedProducts);
    }

    return (
        <>
            <div className="search-container" >
            <input 
            type="text" 
            onChange={handleSearch}
            placeholder="type here to search" />
        </div>
    <div className="shop-container" >
        <div className="product-container">
            {
                displayProducts.map(product => <Product
                    key={product.key}
                    product={product} 
                    handleAddToCart={handleAddToCart}
                    >
                     </Product>)
            }
            <div className="pagination">
{           [...Array(pageCount).keys()]
             .map(number =><button 
                className={number === page ? 'selected': ''}
               key={number} 
               onClick={()=> setPage(number)}
             >{number + 1}</button>)

}
            </div>
        </div>
        <div className="cart-container">
        <h1>Shop</h1>
           <Cart cart={cart}>
           
           </Cart>
           <Link to="/review">
        <button className="btn-regular">Order Your Review</button>
        </Link>
        </div>
    </div>
    <h2 className="fotter-clr">© copyright 2021 www.amazone.com . Developed By Mahabub Hasan</h2>
        </>
    );
};

export default Shop;