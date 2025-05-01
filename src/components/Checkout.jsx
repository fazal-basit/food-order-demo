import CartContext from "../store/CartContext";
import { useContext } from "react";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout(){
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => 
        totalPrice + item.quantity*item.price
    , 0) 
    
    function handleClose(){
        userProgressCtx.hideCheckout()
    }

    function handleCloseCart(){
        userProgressCtx.hideCheckout()
    }

    function handleSubmit(event){
        event.preventDefault();
        const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            })
        });
    }
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCart}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total amount : {currencyFormatter.format(cartTotal)} </p>
            <Input label="Full Name" type="text" id="name" />
            <Input label="E-mail Address" id="email" type="email" />
            <Input label="Street" id="street" type="text" />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>
            <p className="modal-actions">
                <Button type ="button" onClick={handleClose} textOnly>Close</Button>
                <Button>Submit</Button>
            </p>
            
        </form>
    </Modal>
}