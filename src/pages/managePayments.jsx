import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

const CREDITS_PACK = [
    {
        price: 1,
        credits: 10
    },
    {
        price: 4,
        credits: 50
    },
    {
        price: 7,
        credits: 100
    },

];


function ManagePayments() {
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState([]);
    const [userProfile, setUserProfile] = useState(null);

    const getUserProfile = async () => {
        try {
            const resp = await axios.get(`${serverEndpoint}/profile/get-user-info`, { withCredentials: true });
            setUserProfile(resp.data.user);
        }
        catch (error) {
            console.log(error);
            setErrors({ message: "Unable to fetch user profile data" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const paymentResponseHandler = async (credits, payment) => {
        try {
            const resp = await axios.post(
                `${serverEndpoint}/payments/verify-order`,
                {
                    razorpay_payment_id: payment.razorpay_payment_id,
                    razorpay_order_id: payment.razorpay_order_id,
                    razorpay_signature: payment.razorpay_signature,
                    credits: credits
                },
                { withCredentials: true }
            );
            setUserProfile(resp.data.user);
            setMessage({ message: `Payment success, ${credits} are credited to your account` });
        }
        catch (error) {
            console.log(error);
            setErrors({ message: "Unable to process payment request, contact customer service" });
        }
    };

    const handlePayment = async (credits) => {
        try {
            setLoading(true);
            const orderResponse = await axios.post(
                `${serverEndpoint}/payments/create-order`,
                { credits: credits },
                { withCredentials: true }
            );
            const order = orderResponse.data.order;
            const options = {
                key: process.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ExpenseApp",
                description: `Order of purchasing ${credits} credits`,
                order_id: order.id,
                theme: {
                    color: '#3399cc'
                },
                handler: (resp) => { paymentResponseHandler(credits, resp) },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        }
        catch (error) {
            console.log(error);
            setErrors({ message: "Unable to process payment request." });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container p-5">
                {errors.message && (
                    <div className="alert alert-danger" role="alert">
                        {errors.message}
                    </div>
                )}

                {message && (
                    <div className='alert alert-success' role='alert'>
                        {message}
                    </div>
                )}

                <h2>Manage Payments</h2>
                <p><strong>Current Credit Balance:</strong> {userProfile.credits || 0} </p>

                {CREDITS_PACK.map((credit, index) => (
                    <div key={index} className='col-auto border m-2 p-2'>
                        <h4>{credit.credits} Credits</h4>
                        <p>Buy {credit.credits} credits for ${credit.price}</p>
                        <button className='btn btn-outline-primary'
                            onClick={() => { handlePayment(credit.credits) }}>
                            Buy Now
                        </button>
                    </div>
                ))}
            </div>
        </>
    );
};
export default ManagePayments;