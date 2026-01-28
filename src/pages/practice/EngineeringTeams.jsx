const EngineeringTeam = ({employees}) => {
  const engineeringEmployees = employees.filter(employee => employee.department === "Engineering");

  return (
    <div>
      {engineeringEmployees.map(employee => (
        employee.active && <div key={employee.id}>{employee.name}</div>
      ))}
    </div>
  );
};
export default EngineeringTeam;
// use in app.jsx