import { StudentPercen } from "./Student";

function StudentList({ students }) {
    const filteredStudents = students.filter(student => student.percentage >= 33.0); 
    //to create a newlist if filtered students
    return (
        <>
            <h2>Student List Component</h2>
            {filteredStudents.map((student, index) => ( //to iterate
                <StudentPercen 
                    key={index} // to make sure the mapping(for virtual dom injection)
                    name={student.name}
                    rollNumber={student.rollNumber}
                    percentage={student.percentage}
                />
            ))}
        </>
    );
}
export default StudentList;