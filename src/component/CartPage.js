import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/authContext';
import { Button, Modal } from 'react-bootstrap';
import PaymentGateway from './PaymentGateway';
import { PaymentContext } from '../utils/paymentId';
import { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicketAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
const CartPage = () => {
    const setAuth = useContext(AuthContext);
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [choosenData, setChoosenData] = useState();
    const [confirm, setConfirm] = useState(false);
    const { paymentId, setpaymentId } = useContext(PaymentContext);
    const { displayRazorpay } = PaymentGateway();
    const hasRunOnce = useRef(false);
    const handleClose = () => setShow(false);
    const handleConfirm = () => {
        displayRazorpay(choosenData.eventId);
        setShow(false);
    }
    const fetchCartData = () => {
        const queryForCartData = {
            query:
                `query {
                    getCart(customerId:"${setAuth.CustomerId}"){ 
                        _id
                        title
                        price
                        desc
                        date
                        image
                        city
                        state
                        address
                        eventId
            }
        }`
        }
        fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            body: JSON.stringify(queryForCartData),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(response => {
            return response.json();
        }
        ).then(data => {
            if (data.data === null) {
                return;
            }
            setCartData(data.data.getCart);

        }).catch(err=>{
        }).finally(()=>{
            setLoading(false);
        })

    }
    useEffect(() => {
        fetchCartData();
            const timer = setTimeout(() => {
                setLoading(false);
            }, 5000);
            return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!hasRunOnce.current) {
            hasRunOnce.current = true;
            return; // Skip the first run
        }
        if (paymentId) {
            const queryForEvent = {
                query: `
                mutation{
                    addBooking(createBooking:{eventId:"${choosenData.eventId}",customerId:"${setAuth.CustomerId}"}){
                        _id
                        createdAt
                        event{
                            _id
                        }
                        customer{
                            _id
                        }
                        bookedBy{
                            email
                        }
                    }
                }`
            }
            fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
                method: "POST",
                body: JSON.stringify(queryForEvent),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            }).then(response => {
                return response.json();
            })
        }
    }, [paymentId])
    const onBook = (item) => {
        setChoosenData(item);
        setShow(true);
    }
    const onRemove = (item) => {
        const queryForRemove = {
            query: `
                mutation{
                    cartEventDelete(cartCancelInput:{customerId:"${setAuth.CustomerId}",cartId:"${item._id}"}){
                        _id
                        eventId
                    }
                }`
        }
        fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
            method: "POST",
            body: JSON.stringify(queryForRemove),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        }).then(response => {
            return response.json();
        }).then(data => {
            fetchCartData();
        })
    }

    const cartArr = cartData.map((item) => {

        return (
            <div key={item._id} className="d-flex justify-content-center">
                <div className="card mb-4  shadow-sm" style={{ width: '550px' }}>
                    <div className="row g-0">
                        {/* Image on the left - takes 4 columns on md screens and up, full width on smaller screens */}
                        <div className="col-md-6 p-3 d-flex align-items-center justify-content-center bg-light">
                            <img
                                src={item.image || "https://cdn.pixabay.com/photo/2016/11/29/09/08/cart-1867780_1280.png"}
                                alt={item.title}
                                className="img-fluid h-100 w-100"
                                style={{ maxHeight: '200px', minHeight: '200px' }}
                            />
                        </div>

                        {/* Content on the right - takes 8 columns on md screens and up */}
                        <div className="col-md-6">
                            <div className="card-body h-100 w-100 d-flex flex-column">
                                <h5 className="card-title">{item.title}</h5>
                                <p className="card-text text-muted">{item.desc}</p>

                                <div className="mt-auto">
                                    <p className="card-text fs-5">
                                        <strong>₹</strong> {item.price}
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Date: {new Date(Number(item.date)).toLocaleDateString()}
                                        </small>
                                    </p>
                                    <p className="card-text text-muted small mb-2">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> {item.address.charAt(0).toUpperCase()+item.address.slice(1).toLowerCase()}, {''}
                                         {item.city.charAt(0).toUpperCase()+item.city.slice(1).toLowerCase()},
                                         {item.state.charAt(0).toUpperCase()+item.state.slice(1).toLowerCase()}
                                    </p>
                                    <div className="d-flex gap-2 mt-3">
                                        <button
                                            className="btn btn-dark btn-sm px-3 py-0"
                                            onClick={() => onBook(item)}
                                        >
                                            Book Now
                                        </button>
                                        <button
                                            className="btn btn-outline-dark btn-sm px-3 py-0"
                                            onClick={() => onRemove(item)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
    )

    return (
        <>
            <div className="container py-5">
                <h2 className="text-center mb-4">Your Cart</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                       {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-dark" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : cartArr.length > 0 ? (
                            cartArr
                        ) : (
                            <div className="text-center py-5">
                                <img
                                    src="https://cdn.pixabay.com/photo/2016/11/22/23/44/porsche-1851246_1280.jpg"
                                    alt="Empty cart"
                                    className="img-fluid mb-3"
                                    style={{ maxHeight: '200px' }}
                                />
                                <h4 className="text-muted">Your cart is empty</h4>
                                <p className="text-muted">Start shopping to add items to your cart</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {show && <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{choosenData.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body><strong>Date of the event: {new Date(Number(choosenData.date)).toLocaleDateString()}</strong></Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>}
        </>
    );
}
export default CartPage;