// const Home = () => {
//   return (
//     <div
//       className="d-flex flex-column justify-content-center align-items-center"
//       style={{ minHeight: "calc(100vh - 230px)" }}
//     >
//       <header>
//         <h1 className="text-center mb-5">Tell me about...</h1>
//       </header>
//     </div>
//   );
// };

// export default Home;

import React from "react";

const Home = () => {
  return (
    <div className="home-container">
      <header>
        <h1 className="home-title">Welcome to The Gourmet Bistro</h1>
        <p className="home-subtitle">
          Discover our delicious menu and make a reservation today!
        </p>
      </header>
      <div className="home-opening-hours">
        <h2>Our Opening Hours</h2>
        <ul>
          <li>
            <strong>Monday to Friday:</strong> 12:00 AM - 9:30 PM
          </li>
          <li>
            <strong>Saturday:</strong> 12:00 AM - 9:30 PM
          </li>
          <li>
            <strong>Sunday:</strong> 12:00 AM - 9:30 PM
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
