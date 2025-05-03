import CartContext from "../store/CartContext";
import { useContext } from "react";
import Modal from "./UI/Modal";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from '../hooks/useHtpp'
import Error from "./Error";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
};

export default function Checkout(){
    const cartCtx = useContext(CartContext)
    const userProgressCtx = useContext(UserProgressContext)
    const {data, isLoading: isSending, error, sendRequest, clearData} = useHttp('http://localhost:3000/orders', requestConfig)
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => 
        totalPrice + item.quantity*item.price
    , 0) 
    
    function handleClose(){
        userProgressCtx.hideCheckout()
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    function handleCloseCart(){
        userProgressCtx.hideCheckout()
    }

    async function checkoutAction(fd){
        // event.preventDefault();
        // const fd = new FormData(event.target);
        const customerData = Object.fromEntries(fd.entries());

        await sendRequest(JSON.stringify({
                order: {
                    items: cartCtx.items,
                    customer: customerData
                }
            }));

        // fetch('http://localhost:3000/orders', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type' : 'application/json'
        //     },
        //     body : JSON.stringify({
        //         order: {
        //             items: cartCtx.items,
        //             customer: customerData
        //         }
        //     })
        // });
    }

    let actions = (
        <>
            <Button type ="button" onClick={handleClose} textOnly>Close</Button>
            <Button>Submit</Button>
        </>
    )
    if(isSending){
        actions = <span>Sending order data...</span>
    }

    if(data && !error){
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success</h2>
            <p>Your order was submitted</p>
            <p>We will get back to you with more details within minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }
    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleCloseCart}>
        <form action={checkoutAction}>
            <h2>Checkout</h2>
            <p>Total amount : {currencyFormatter.format(cartTotal)} </p>
            <Input label="Full Name" type="text" id="name" />
            <Input label="E-mail Address" id="email" type="email" />
            <Input label="Street" id="street" type="text" />
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code" />
                <Input label="City" type="text" id="city" />
            </div>
            {error &&<Error title="Failed to submit order." message={error} />}
            <p className="modal-actions">
                {actions}
            </p>
            
        </form>
    </Modal>
}