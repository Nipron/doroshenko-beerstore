import React, {Component} from 'react';
import {detailProduct, storeProducts} from "./data";

const ProductContext = React.createContext();

class ProductProvider extends Component {

    state = {
        products: [],
        detailProduct: detailProduct,
        cart: [],
        modalOpen: false,
        modalProduct: detailProduct,
        cartSubtotal: 0,
        cartTax: 0,
        cartTotal: 0
    };

    componentDidMount() {
        this.setProducts();
    }

    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = {...item};
            tempProducts = [...tempProducts, singleItem];
        });
        this.setState(() => {
            return {products: tempProducts};
        });
    };

    getItem = id => this.state.products.find(item => item.id === id)

    handleDetail = (id) => {
        const product = this.getItem(id);
        this.setState(() => {
            return {detailProduct: product}
        })
    };

    addToCart = id => {
        //let tempProducts = [...this.state.products];
        //const index = tempProducts.indexOf(this.getItem(id));
        const index = this.state.products.indexOf(this.getItem(id));
        //const product = tempProducts[index];
        const product = this.state.products[index];
        product.inCart = true;
        product.count = 1;
        product.total = product.price;
        this.setState(() => {
            return {
                //products: tempProducts,
                cart: [...this.state.cart, product]
            };
        }, () => {
            this.addTotals();
        })
    };

    openModal = id => {
        const product = this.getItem(id);
        this.setState(() => {
            return {modalProduct: product, modalOpen: true}
        })
    }

    closeModal = () => {
        this.setState(() => {
            return {modalOpen: false}
        })
    }

    increment = (id) => {
        /* let tempCart = [...this.state.cart]
         const selectedProduct = tempCart.find(item => item.id === id)
         const index = tempCart.indexOf(selectedProduct);
         const product = tempCart[index];
         product.count ++;
         product.total = product.count * product.price;
         this.setState(() => {return{cart:[...tempCart]}},() => this.addTotals())*/
        const product = this.state.cart[this.state.cart.indexOf(this.state.cart.find(item => item.id === id))];
        product.count++;
        product.total = product.count * product.price;
        this.setState(() => {
        }, () => this.addTotals())
    }

    decrement = (id) => {
        const product = this.state.cart[this.state.cart.indexOf(this.state.cart.find(item => item.id === id))];
        product.count--;

        if (product.count === 0) {
            this.removeItem(id)
        } else {
            product.total = product.count * product.price;
            this.setState(() => {
            }, () => this.addTotals())
        }
    }

    removeItem = (id) => {
        // let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
        tempCart = tempCart.filter(item => item.id !== id);
        //const index = tempProducts.indexOf(this.getItem(id));
        const index = this.state.products.indexOf(this.getItem(id));
        //  let removedProduct = tempProducts[index];
        let removedProduct = this.state.products[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;

        this.setState(() => {
            return {
                cart: [...tempCart],
                //  products: [...tempProducts]
            }
        }, () => this.addTotals())
    }

    clearCart = () => {
        this.setState(() => {
            return {cart: []}
        }, () => {
            this.setProducts();
            this.addTotals();
        })
    }

    addTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item => (subTotal += item.total))
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        this.setState(() => {
            return {
                cartSubtotal: subTotal,
                cartTax: tax,
                cartTotal: total
            }
        })
    }

    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                handleDetail: this.handleDetail,
                addToCart: this.addToCart,
                openModal: this.openModal,
                closeModal: this.closeModal,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}>
                {this.props.children}
            </ProductContext.Provider>
        )
    }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer};