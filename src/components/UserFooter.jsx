import { Link } from 'react-router-dom';

function UserFooter() {
    return (
        <>
            <footer class="bg-dark text-white pt-5 pb-4">
                <div class="container text-center text-md-left">
                    <div class="row text-center text-md-left">

                        <div class="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                            <h4 class="text-center mb-4 font-weight-bold"><span className="text-primary">Expense</span>App</h4>
                            <p>ExpenseApp is the app used to plan and manage your expenses efficiently with your friends & family.</p>
                        </div>
                        <hr class="mb-4" />

                        <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
                            <h5 class="text-uppercase mb-4">All rights Reserved.</h5>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default UserFooter;