import React from "react";

const About = () => {
  return (
      <div className="container-fluid my-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="text-center mb-4">About Shopsphere</h1>

            <p>
              <strong>Shopsphere</strong> is your one-stop online marketplace
              dedicated to bringing quality products right to your doorstep.
              Our mission is to make shopping easy, safe, and enjoyable for
              everyone.
            </p>

            <h4 className="mt-4">Our Mission</h4>
            <p>
              To provide customers with a wide range of products, competitive
              prices, and excellent service, all while maintaining a seamless
              online shopping experience.
            </p>

            <h4 className="mt-4">Our Vision</h4>
            <p>
              To become the most trusted and preferred e-commerce platform, connecting
              people with the products they love and need.
            </p>

            <h4 className="mt-4">Our Values</h4>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">Customer First: Prioritizing customer satisfaction.</li>
              <li className="list-group-item">Integrity: Transparent and honest practices.</li>
              <li className="list-group-item">Innovation: Constantly improving our platform and services.</li>
              <li className="list-group-item">Quality: Offering only high-quality products.</li>
            </ul>

            <h4 className="mt-4">Our Team</h4>
            <p>
              Shopsphere is built by a passionate team of developers, marketers,
              and customer support specialists, all working together to create
              the best online shopping experience for our users.
            </p>
          </div>
        </div>
      </div>
  );
};

export default About;

