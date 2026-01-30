/**
 * JSX is the combination of HTML, CSS, and JavaScript code.
 * Its an extension created by React.
 * 
 * Every component must return single parent node which will be rendered.
 */

function Student(){
    let name = "John Doe";
    let rollNubmer= 10;
    return (
        <>
            <p>Name: {name}</p>
            <p>Roll Number: {rollNubmer}</p>
        </>
    );
}

function Studentdestruct({name = 'Tommy', rollNumber = 10}){
    return ( //destructuring props
        <>
            <p>Name: {name}</p>
            <p>Roll Number: {rollNumber}</p>
        </>
    );
}

function Studentprops(props){
    return (// without destructuring props
        <>
            <p>Name: {props.name}</p>
            <p>Roll Number: {props.rollNumber}</p>
        </>
    );
}

function StudentPercen({name, rollNumber, percentage}){
    return (
        <>
            {percentage > 33.0 && (
                <p>Student Name: {name} <br/>
                   Roll Number: {rollNumber}<br/>
                   Percentage: {percentage} - Pass</p>
            )}

            {percentage <= 33.0 && (
                <p>Student Name: {name} <br/>
                   Roll Number: {rollNumber}<br/>
                   Percentage: {percentage} - Fail</p>
            )}
        </>
    );
}
// export default Student; // if i have & waant to export a single function/component
// Provide named exports so consumers can import individually
export { Student, Studentdestruct, Studentprops, StudentPercen };