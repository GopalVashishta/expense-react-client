import {useState} from 'react';

function StudentButton({list}) {
    const [visible, setVisible] = useState(true);// original var & funct to change tht var
    const [buttonText, setButtonText] = useState('Display Students');
    const studentList = [
        {name: 'Eve', rollNumber: 5},
        {name: 'Frank', rollNumber: 12},
        {name: 'Grace', rollNumber: 18},
    ];
    const handleClick = () => {
        setVisible(!visible); //not actually changing val coz may lot of renders so @end change
        setButtonText(visible ? 'Display Students' : 'Hide Students'); // opp. vals if using IF ELSE instead
    };

    return (
        <>
            <div>
                <button onClick={handleClick}>{buttonText}</button>
                {visible && (
                    <>
                        {studentList.map((student, index) => (
                            <p key={index}>
                                Name: {student.name}
                                <br />
                                Roll Number: {student.rollNumber}
                            </p>
                        ))}
                    </>
                )}
            </div>
        </>
    );
}

export default StudentButton;