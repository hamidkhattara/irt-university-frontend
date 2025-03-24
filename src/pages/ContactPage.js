import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const baseURL = process.env.REACT_APP_API_URL || "link";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(t("contact.sending"));

    try {
      const response = await fetch(`${baseURL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setStatus(t("contact.success"));
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(result.message || t("contact.fail"));
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus(t("contact.error"));
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Navbar />
      <section className="bg-blue-900 text-white py-24 text-center">
        <h1 className="text-5xl font-extrabold">{t("contact.title")}</h1>
        <p className="mt-6 text-xl max-w-2xl mx-auto">{t("contact.subtitle")}</p>
      </section>
      <section className="container mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-blue-900 text-center">{t("contact.sendMessageTitle")}</h2>
        <form
          className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-12 space-y-6"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block text-lg font-semibold text-gray-700">{t("contact.nameLabel")}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder={t("contact.namePlaceholder")}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">{t("contact.emailLabel")}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg"
              placeholder={t("contact.emailPlaceholder")}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700">{t("contact.messageLabel")}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full mt-2 p-3 border rounded-lg"
              rows="5"
              placeholder={t("contact.messagePlaceholder")}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-900 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {t("contact.sendButton")}
          </button>
          {status && <p className="text-center text-sm text-green-600 mt-4">{status}</p>}
        </form>
      </section>
      <section className="bg-gray-100 py-16 text-center">
        <h2 className="text-4xl font-bold text-blue-900">{t("contact.detailsTitle")}</h2>
        <p className="text-lg text-gray-700 mt-4">{t("contact.address")}</p>
        <p className="text-lg text-gray-700 mt-2">{t("contact.emailPhone")}</p>
      </section>
      <Footer />
    </div>
  );
};

export default ContactPage;