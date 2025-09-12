import React from "react";
import Layout from "../components/layout/Layout";

const PrivacyPolicy = () => {
  return (
      <div className="container-fluid my-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h1 className="text-center mb-4">Privacy Policy</h1>

            <p>
              At <strong>Shopsphere</strong>, your privacy is important to us. This
              Privacy Policy explains how we collect, use, and protect your
              information when you use our platform.
            </p>

            <h4 className="mt-4">1. Information We Collect</h4>
            <p>
              We may collect personal details such as your name, email, phone
              number, address, and payment information when you create an account,
              place an order, or interact with our services.
            </p>

            <h4 className="mt-4">2. How We Use Your Information</h4>
            <ul className="list-group list-group-flush mb-3">
              <li className="list-group-item">To process and deliver your orders.</li>
              <li className="list-group-item">To improve our website, products, and customer service.</li>
              <li className="list-group-item">To send important updates, promotions, or security alerts.</li>
            </ul>

            <h4 className="mt-4">3. Sharing of Information</h4>
            <p>
              We do not sell or trade your personal information. However, we may
              share it with trusted partners (e.g., payment processors, shipping
              companies) to provide services.
            </p>

            <h4 className="mt-4">4. Data Security</h4>
            <p>
              We use industry-standard security measures to protect your data from
              unauthorized access, disclosure, or misuse.
            </p>

            <h4 className="mt-4">5. Your Rights</h4>
            <p>
              You have the right to access, update, or delete your personal data.
              You can contact us anytime to exercise these rights.
            </p>

            <h4 className="mt-4">6. Updates to This Policy</h4>
            <p>
              We may update this Privacy Policy from time to time. Any changes will
              be posted on this page with the updated date.
            </p>

            <h4 className="mt-4">7. Contact Us</h4>
            <p>
              If you have any questions about this Privacy Policy, please contact us
              at <strong>support@shopsphere.com</strong>.
            </p>
          </div>
        </div>
      </div>
  );
};

export default PrivacyPolicy;
