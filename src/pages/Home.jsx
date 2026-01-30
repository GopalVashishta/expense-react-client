import { useNavigate } from 'react-router-dom';

function Home(){
    const navigate = useNavigate();
    const routeReg =  () =>{
        navigate('/register');
    }

    return (
        <>
        <div className="container">
            <h2 className="text-center">Welcome to Expense App</h2>
            <input type="button" value="Register" onClick={routeReg}/>
        </div>
        </>
    );
}
export default Home;