import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, ShieldCheck, CreditCard, Wallet, Calendar, Repeat, Lock, Gift, Sparkles } from "lucide-react";

interface FormData {
  package: string;
  amount: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  country: string;
  region: string;
  zip: string;
  message: string;
}

type PaymentMethod = "card" | "bank" | "mobile";
type Frequency = "one-time" | "monthly" | "yearly";

const DonationForm: React.FC = () => {
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("USD");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [isCustomAmount, setIsCustomAmount] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    package: "Musical Instruments",
    amount: "",
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    country: "",
    region: "",
    zip: "",
    message: "",
  });

  const packages: string[] = [
    "Musical Instruments",
    "Church Construction",
    "Church Equipments",
    "Guest House Support",
    "Community Outreach",
    "Other",
  ];

  const donationTiers = [
    { amount: 25, label: "Supporter", icon: Heart, color: "text-rose-500", bg: "bg-rose-50", border: "border-rose-200" },
    { amount: 50, label: "Friend", icon: Gift, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    { amount: 100, label: "Guardian", icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
    { amount: 250, label: "Champion", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTierSelect = (amount: number) => {
    setSelectedTier(amount);
    setIsCustomAmount(false);
    setFormData((prev) => ({
      ...prev,
      amount: amount.toString(),
    }));
  };

  const handleCustomAmount = () => {
    setIsCustomAmount(true);
    setSelectedTier(null);
    setFormData((prev) => ({
      ...prev,
      amount: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!formData.amount || Number(formData.amount) <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    if (!isAnonymous && (!formData.fullName || !formData.email)) {
      alert("Please fill in your name and email.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        currency,
        isAnonymous,
        paymentMethod,
        frequency,
      };

      console.log("Submitting donation:", payload);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Donation submitted successfully!");

      // Reset form
      setFormData({
        package: "Musical Instruments",
        amount: "",
        fullName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        country: "",
        region: "",
        zip: "",
        message: "",
      });
      setCurrency("USD");
      setIsAnonymous(false);
      setSelectedTier(null);
      setIsCustomAmount(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl w-full bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="text-amber-400" size={32} fill="currentColor" />
              <h2 className="text-3xl font-bold">
                Make a <span className="text-amber-400">Difference</span>
              </h2>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              Your generosity fuels our mission to serve communities and spread hope.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Donation Frequency Toggle */}
            <div className="flex gap-3 p-1 bg-gray-100 rounded-xl">
              {[
                { value: "one-time", label: "One Time", icon: CreditCard },
                { value: "monthly", label: "Monthly", icon: Calendar },
                { value: "yearly", label: "Yearly", icon: Repeat },
              ].map((freq) => (
                <button
                  key={freq.value}
                  type="button"
                  onClick={() => setFrequency(freq.value as Frequency)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                    frequency === freq.value
                      ? "bg-amber-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <freq.icon size={18} />
                  {freq.label}
                </button>
              ))}
            </div>

            {/* Donation Tiers */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Choose an Amount
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {donationTiers.map((tier) => (
                  <motion.button
                    key={tier.amount}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTierSelect(tier.amount)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedTier === tier.amount
                        ? `${tier.bg} ${tier.border} border-2 shadow-md`
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <tier.icon className={`${tier.color} mx-auto mb-2`} size={24} />
                    <div className={`font-bold ${tier.color}`}>${tier.amount}</div>
                    <div className="text-xs text-gray-500">{tier.label}</div>
                  </motion.button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCustomAmount}
                className={`w-full py-3 rounded-xl border-2 transition-all font-medium ${
                  isCustomAmount
                    ? "border-amber-500 bg-amber-50 text-amber-700"
                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                }`}
              >
                Custom Amount
              </button>
              {isCustomAmount && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3"
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-500">
                      {currency === "USD" ? "$" : "Br"}
                    </span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="Enter amount"
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Package Selection */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Support Our Work In
              </label>
              <select
                name="package"
                value={formData.package}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
              >
                {packages.map((pkg) => (
                  <option key={pkg} value={pkg}>
                    {pkg}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "card", label: "Credit Card", icon: CreditCard },
                  { value: "bank", label: "Bank Transfer", icon: Wallet },
                  { value: "mobile", label: "Mobile Money", icon: Lock },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value as PaymentMethod)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === method.value
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    <method.icon size={20} />
                    <span className="text-xs font-medium">{method.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <User className={isAnonymous ? "text-amber-500" : "text-gray-400"} size={20} />
                <span className="text-sm font-medium text-gray-700">
                  Donate Anonymously
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAnonymous((prev) => !prev)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  isAnonymous ? "bg-amber-500" : "bg-gray-300"
                }`}
              >
                <motion.div
                  animate={{ x: isAnonymous ? 26 : 2 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                />
              </button>
            </div>

            {/* Personal Info */}
            <AnimatePresence>
              {!isAnonymous && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Full Name *"
                      className="form-input"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address *"
                      className="form-input"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number (Optional)"
                    className="form-input"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Street Address"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="form-input"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      placeholder="State/Region"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="form-input"
                    />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Leave a message (Optional)"
                    rows={3}
                    className="form-input resize-none"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Currency Selector */}
            <div className="flex items-center justify-end gap-2">
              <span className="text-xs text-gray-500">Currency:</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="text-sm font-semibold text-amber-600 bg-transparent border-none focus:ring-0 cursor-pointer"
              >
                <option value="USD">USD ($)</option>
                <option value="BIRR">BIRR (Br)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Security Notice & Submit */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={14} />
                <span>Secure SSL Encrypted Payment</span>
                <Lock size={14} />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-amber-500/25"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  `Complete ${frequency === "one-time" ? "Donation" : frequency === "monthly" ? "Monthly Pledge" : "Yearly Pledge"}`
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <style>{`
        .form-input {
          width: 100%;
          background-color: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: #f59e0b;
          ring: 2px solid #fef3c7;
        }
      `}</style>
    </section>
  );
};

export default DonationForm;