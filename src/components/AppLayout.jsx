import Header from "./Header";
import Footer from "./Footer";
// it will reander header at top , footer at boottom and render the body in b/w
function AppLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
export default AppLayout;