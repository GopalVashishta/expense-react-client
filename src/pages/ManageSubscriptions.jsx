import { useEffect, useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../config/appConfig";

const PLAN_IDS = {
    //Add more attributes as needed
    UNLIMITED_MONTHLY: {
        planName: "Unlimited Monthly",
        price: 5,
        frequency: "monthly",
    },
    UNLIMITED_YEARLY: {
        planName: "Unlimited Yearly",
        price: 50,
        frequency: "yearly",
    },
};

function ManageSubscriptions() {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);

    const getUserProfile = async () => {
        try {
            const resp = await axios.get(`${serverEndpoint}/profile/get-user-info`, { withCredentials: true });
            setUserProfile(resp.data.user);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Failed to fetch user profile" });
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUserProfile();
    }, []);

    const rzpResponseHandler = async (resp) => {
        try {
            setLoading(true);
            const captureResponse = await axios.post(`${serverEndpoint}/payments/capture-subscription`,
                { subscriptionId: resp.razorpay_subscription_id },
                { wthCredentials: true }
            );
            setMessage("Subscription successful!");
            setUserProfile(captureResponse.data.user);
        } catch (error) {
            console.log(error);
            setErrors({ message: "Subscription successful but failed to update server. Please contact support if your subscription is not reflected in your profile." });
        }
        finally {
            setLoading(false);
        }
    };

    const handleSubscribe = async (planName) => {
        try {
            setLoading(true);
            const createSubscriptionResponse = await axios.post(`${serverEndpoint}/payments/create-subscription`,
                { plan_name: planName, },
                { withCredentials: true }
            );

            const subscription = createSubscriptionResponse.data.subscription;
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                name: PLAN_IDS[planName].planName, //only send the name
                description: `Subscription for ${PLAN_IDS[planName].price} ${PLAN_IDS[planName].frequency}`,
                subscription_id: subscription.id,
                theme: {
                    color: "#3399cc"
                },
                handler: (resp) => { rzpResponseHandler(resp); }

            };
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.log(error);
            setErrors({ message: "Unable to process Subscription request" });
        }
        finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="container p-5 text-center">
                <div className='spinner-border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            </div>
        );
    }

    const showSubscriptions = [undefined, 'completed', 'cancelled'].includes(userProfile?.subscription?.status);

    return (
        <>
            <div className="container p-5">
                {errors?.message && (
                    <div className="alert alert-danger" role="alert">
                        {errors.message}
                    </div>
                )}

                {message && (
                    <div className='alert alert-success' role='alert'>
                        {message}
                    </div>
                )}

                {showSubscriptions && (
                    <>
                        {Object.keys(PLAN_IDS).map((key) => (
                            <div className='col-auto border m-2 p-2' key={key}>
                                <h4>{PLAN_IDS[key].planName}</h4>
                                <p>Pay INR {PLAN_IDS[key].price}  {PLAN_IDS[key].frequency}</p>

                                <button className='btn btn-outline-primary' onClick={() => { handleSubscribe(key) }}>
                                    Subscribe
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {!showSubscriptions && (
                    <>
                        <div className='col-auto border m-2 p-2'>
                            Plan ID: {userProfile.subscription.planId} <br />
                            Subscription ID: {userProfile.subscription.subscriptionId} <br />
                            Subscription Status: {userProfile.subscription.status} <br />
                        </div>
                    </>
                )}
            </div>
        </>
    );
};
export default ManageSubscriptions;