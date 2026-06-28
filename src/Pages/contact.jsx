import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

const Contact = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Validation Error State
  const [errors, setErrors] = useState({});
  // Track if a user has clicked into/out of a field
  const [touched, setTouched] = useState({});
  // Submission Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation Logic
  const validateField = (name, value) => {
    let error = "";
    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address.";
      }
    } else if (name === "message" && value.trim().length < 10) {
      error = "Message must be at least 10 characters long.";
    }
    return error;
  };

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, name: value }));

    // Real-time validation if the field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle Blur (User leaves an input field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate all fields
    const currentErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) currentErrors[key] = error;
    });

    setErrors(currentErrors);

    // If no errors, proceed with submission logic
    if (Object.keys(currentErrors).length === 0) {
      setIsSubmitting(true);
      try {
        // Simulate API Request
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTouched({});
      } catch (err) {
        console.error("Submission failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 antialiased font-sans p-6 sm:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* ══ HEADER ══ */}
        <div className="border-b border-slate-200 pb-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-slate-900" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Lumière Boutique</p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Contact Concierge
          </h1>
        </div>

        {/* ══ MAIN LAYOUT GRID ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
          
          {/* COLUMN 1: BRAND INFORMATION (4 Cols) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-3">
              <h3 className="text-lg font-medium text-slate-900">How can we assist you?</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Whether you are tracking a signature scent profile or require assistance with your luxury order, our team is at your disposal.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                  <Mail size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Email Us</h4>
                  <p className="text-sm font-medium text-slate-800">concierge@lumiere.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                  <Phone size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Call Us</h4>
                  <p className="text-sm font-medium text-slate-800">+91 (800) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm shrink-0">
                  <MapPin size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Boutique Atelier</h4>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    Level 4, The Galleria Mall,<br />Mumbai, MH 400051
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: CONTACT FORM (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-10">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100">
                  <CheckCircle size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900">Message Dispatched</h3>
                <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                  Thank you for reaching out. A client services representative will contact you within 24 business hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 underline transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full text-sm px-4 py-3 bg-[#fafafa] rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        touched.name && errors.name
                          ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20"
                          : "border-slate-200/80 focus:border-slate-900"
                      }`}
                      placeholder="E.g., Julian Vance"
                    />
                    {touched.name && errors.name && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full text-sm px-4 py-3 bg-[#fafafa] rounded-xl border transition-all focus:outline-none focus:bg-white ${
                        touched.email && errors.email
                          ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20"
                          : "border-slate-200/80 focus:border-slate-900"
                      }`}
                      placeholder="name@example.com"
                    />
                    {touched.email && errors.email && (
                      <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-1.5">
                  <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full text-sm px-4 py-3 bg-[#fafafa] rounded-xl border transition-all focus:outline-none focus:bg-white ${
                      touched.subject && errors.subject
                        ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20"
                        : "border-slate-200/80 focus:border-slate-900"
                    }`}
                    placeholder="How can we categorize your inquiry?"
                  />
                  {touched.subject && errors.subject && (
                    <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Message Description
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full text-sm px-4 py-3 bg-[#fafafa] rounded-xl border transition-all focus:outline-none focus:bg-white resize-none ${
                      touched.message && errors.message
                        ? "border-rose-300 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/20"
                        : "border-slate-200/80 focus:border-slate-900"
                    }`}
                    placeholder="Provide explicit details regarding your request..."
                  />
                  {touched.message && errors.message && (
                    <p className="text-[11px] text-rose-500 font-medium pl-1">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-xs font-semibold uppercase tracking-wider bg-slate-900 text-white rounded-xl py-3.5 px-4 flex items-center justify-center gap-2 shadow-sm hover:bg-slate-800 transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} strokeWidth={2.5} />
                      <span>Transmit Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;