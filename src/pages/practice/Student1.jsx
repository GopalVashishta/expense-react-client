function Student1({name = 'Tommy', rollNumber = 10}){
    return ( //destructuring props
        <>
            <p>Name: {name}</p>
            <p>Roll Number: {rollNumber}</p>
        </>
    );
}
function Student2(props){
    return (// without destructuring props
        <>
            <p>Name: {props.name}</p>
            <p>Roll Number: {props.rollNumber}</p>
        </>
    );
}
export default {Student1, Student2};