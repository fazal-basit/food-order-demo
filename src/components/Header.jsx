import logoImg from '../assets/logo.jpg'
import BUtton from './UI/Button';
import CartContext from '../store/CartContext';
import { useContext } from 'react';
import UserProgressContext from '../store/UserProgressContext';

export default function Header(){
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext)

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0);

    function handleShowCart(){
        userProgressCtx.showCart()
    }
    return (
    <header id="main-header">
        <div id="title">
            <img src={logoImg} alt="A Restaurant"/>
            <h1>React Food</h1>
        </div>
        <nav>
            <BUtton textOnly onClick={handleShowCart}>Cart ({totalCartItems})</BUtton>
        </nav>
    </header>
    );
}