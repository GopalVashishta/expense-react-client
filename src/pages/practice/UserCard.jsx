const UserCard = ({ name, age, location, isPremium }) => {
  return (
    <>  
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <p>Location: {location}</p>
      <p>
        {isPremium ? 'VIP Member' : 'Standard Member'}
      </p>
    </>
  );
};

export default UserCard;