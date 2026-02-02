import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    const routeReg =  () =>{
        navigate('/login');
    }

    return (
        <>
        <div className="container">
            <h2 className="text-center">Welcome to Expense App</h2>
            <p>Personal expense managing app. Split your expenses easily and stay on budget.
                the REst is just a restful text no need to read
            </p>
        </div>
        </>
    );
}
export default Home;