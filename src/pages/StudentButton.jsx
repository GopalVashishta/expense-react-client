import {useState} from 'react';

function StudentButton({list}) {
    const [visible, setVisible] = useState(true);// original var & funct to change tht var
    const studentList = [
        {name: 'Eve', rollNumber: 5},
        {name: 'Frank', rollNumber: 12},
        {name: 'Grace', rollNumber: 18},
    ];
    const handleClick = () => {
        setVisible(!visible);
    };

    return (
        <>
            <div>
                <button onClick={handleClick}>{visible ? 'Hide Students' : 'Display Students'}</button>
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