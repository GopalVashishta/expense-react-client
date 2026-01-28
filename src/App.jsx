import { useState } from 'react'
import   {Student, Studentdestruct, Studentprops, StudentPercen} from './pages/Student'
import StudentList from './pages/StudentList'
import StudentButton from './pages/StudentButton.jsx'

import UserCard from './pages/practice/UserCard.jsx' 
import ProductList from './pages/practice/ProductList.jsx'
import EngineeringTeam from './pages/practice/EngineeringTeams.jsx'

function App() {
  const [count, setCount] = useState(0)
  const products = [ { id: 1, name: "Laptop", price: 999, category: "Electronics" },
    { id: 2, name: "Coffee Maker", price: 49, category: "Home" },
    { id: 3, name: "Smartphone", price: 699, category: "Electronics" } ];
  const employees = [
    { id: 101, name: "Alice", department: "Engineering", active: true },
    { id: 102, name: "Bob", department: "Design", active: false },
    { id: 103, name: "Charlie", department: "Engineering", active: true },
    { id: 104, name: "David", department: "HR", active: true }
    ];

  return (
    <>
      <h1>Welcome To Expense App</h1>
      <Student />
      <Studentdestruct name="Alice" rollNumber={25} />
      <Studentprops name="Bob" rollNumber={30} />
      <StudentPercen name="Charlie" rollNumber={15} percentage={45.5} />
      <StudentPercen name="David" rollNumber={20} percentage={28.0} />
      <StudentList students={[
        { name: 'Eve', rollNumber: 5, percentage: 75.0 },
        { name: 'Frank', rollNumber: 12, percentage: 32.5 },
        { name: 'Grace', rollNumber: 18, percentage: 88.0 },
      ]} />
      <UserCard name="Henry" age={29} location="New York" isPremium={true} />
      <UserCard name="Isabella" age={24} location="Los Angeles" isPremium={false} />
      <UserCard name="Jack" age={31} location="Chicago" isPremium={true} />
      <ProductList products={products} />
      <EngineeringTeam employees={employees} />
      <StudentButton />
      
    </>
  )
}

export default App;