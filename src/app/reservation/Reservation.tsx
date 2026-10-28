"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// --- TYPES ---
interface SelectCardProps {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  delay?: number;
}

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

interface SectionTitleProps {
  children: React.ReactNode;
  delay?: number;
}

interface AnimatedInputProps {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  delay?: number;
}

interface AnimatedSelectProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: number[];
  delay?: number;
  labelSuffix: string;
}

// --- SHARED UI COMPONENTS ---

const SelectCard: React.FC<SelectCardProps> = ({
  children,
  selected,
  onClick,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`cursor-pointer border transition-all duration-500 rounded-2xl p-4 h-full
        hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]
        ${
          selected
            ? "border-orange-400 bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            : "border-neutral-700 bg-gradient-to-br from-neutral-900 to-black hover:border-orange-400/50"
        }
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
        }`}
    >
      {children}
    </div>
  );
};

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative mt-4 bg-gradient-to-r from-orange-500 to-orange-600
        hover:from-orange-600 hover:to-orange-700 transition-all duration-500
        rounded-xl py-4 text-white w-full font-semibold text-lg
        overflow-hidden group ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {!disabled && (
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )}
      </span>
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
    </button>
  );
};

const SectionTitle: React.FC<SectionTitleProps> = ({
  children,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <h3
      ref={titleRef}
      className={`text-xl md:text-2xl mb-6 font-light tracking-wide transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10"
      }`}
    >
      <span
        className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-semibold"
        aria-hidden="true"
      >
        {"//"}
      </span>{" "}
      {children}
    </h3>
  );
};

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (inputRef.current) observer.observe(inputRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <div
      ref={inputRef}
      className={`relative transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10"
      }`}
    >
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-transparent border-b-2 p-3 pl-0 outline-none transition-all duration-300 ${
          isFocused
            ? "border-orange-400 text-white"
            : "border-neutral-700 text-neutral-300 hover:border-neutral-500"
        } ${type === "date" ? "[color-scheme:dark]" : ""}`}
      />
      <div
        className={`absolute bottom-0 left-0 h-[2px] bg-orange-400 transition-all duration-500 ${
          isFocused ? "w-full" : "w-0"
        }`}
      />
    </div>
  );
};

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  value,
  onChange,
  options,
  delay = 0,
  labelSuffix,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timeoutId = setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (selectRef.current) observer.observe(selectRef.current);

    return () => {
      observer.disconnect();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [delay]);

  return (
    <div
      ref={selectRef}
      className={`relative transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-x-0"
          : "opacity-0 -translate-x-10"
      }`}
    >
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b-2 border-neutral-700 p-3 pl-0 outline-none focus:border-orange-400 transition-all duration-300 cursor-pointer text-white appearance-none"
      >
        {options.map((num) => (
          <option key={num} value={num} className="bg-neutral-900">
            {num} {num === 1 ? labelSuffix.replace(/s$/, "") : labelSuffix}
          </option>
        ))}
      </select>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          className="w-5 h-5 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

// --- MAIN RESERVATION PAGE ---

const Reservation: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [checkoutDate, setCheckoutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [cars, setCars] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const packages = [
    { id: "single", title: "Solitary Retreat", price: "1000 ETB", icon: "🌿" },
    { id: "group", title: "Group Unity Stay", price: "3000 ETB", icon: "👥" },
    { id: "culinary", title: "Fasting Meals", price: "1500 ETB", icon: "🍃" },
    { id: "camp", title: "Camp Fire Nights", price: "2000 ETB", icon: "🔥" },
  ];

  const paymentMethods = [
    { name: "Telebirr", icon: "📱" },
    { name: "CBE", icon: "💳" },
    { name: "Berhan", icon: "🏦" },
    { name: "Cash", icon: "💵" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    } else {
      setFile(null);
      setFileName(null);
    }
  };

  const handleSubmit = async () => {
    if (
      !fullName.trim() ||
      !email.trim() ||
      !arrivalDate ||
      !checkoutDate ||
      !selectedPackage ||
      !paymentMethod
    ) {
      alert(
        "Please fill in all dates, select a package, and choose a payment method."
      );
      return;
    }

    if (new Date(checkoutDate) <= new Date(arrivalDate)) {
      alert("Check-out date must be after the arrival date.");
      return;
    }

    if (paymentMethod !== "Cash" && !file) {
      alert("Please upload a screenshot of your payment receipt.");
      return;
    }

    setIsSubmitting(true);

    try {
      let receiptUrl: string | null = null;

      // Upload receipt to Supabase Storage for non-cash payments.
      if (file && paymentMethod !== "Cash") {
        const fileExt = file.name.split(".").pop() || "file";
        const fileNamePath = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("guest-house-receipts")
          .upload(fileNamePath, file);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage
          .from("guest-house-receipts")
          .getPublicUrl(fileNamePath);

        receiptUrl = publicUrl;
      }

      // Insert reservation into Supabase.
      const { error: insertError } = await supabase
        .from("guest_house_reservations")
        .insert([
          {
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            arrival_date: arrivalDate,
            checkout_date: checkoutDate,
            guests: selectedPackage === "group" ? guests : 1,
            cars: selectedPackage === "group" ? cars : 0,
            package_id: selectedPackage,
            payment_method: paymentMethod,
            receipt_url: receiptUrl,
            status: "pending",
          },
        ]);

      if (insertError) throw insertError;

      alert(
        "Reservation submitted successfully! Our manager will review your request."
      );

      // Reset form.
      setFullName("");
      setPhone("");
      setEmail("");
      setArrivalDate("");
      setCheckoutDate("");
      setGuests(1);
      setCars(0);
      setSelectedPackage(null);
      setPaymentMethod(null);
      setFileName(null);
      setFile(null);
    } catch (err: unknown) {
      console.error("Submission Error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while submitting your reservation.";

      alert("Error: " + message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-neutral-950 text-white overflow-x-hidden pb-20">
      {/* Back Button */}
      <div className="absolute top-6 left-4 md:left-10 z-20">
        <Link
          href="/Guest"
          className="flex items-center gap-2 text-neutral-400 hover:text-orange-400 transition-colors group"
        >
          <div className="p-2 rounded-full border border-neutral-800 group-hover:border-orange-400/50 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </div>
          <span className="font-medium tracking-wide">
            Back to Guest House
          </span>
        </Link>
      </div>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-[-10%] w-[50%] h-[50%] bg-orange-900 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-24 md:pt-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-700 bg-clip-text text-transparent uppercase">
              Reservation
            </span>
          </h1>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column: Details */}
          <div className="space-y-12">
            <div>
              <SectionTitle delay={100}>Guest Information</SectionTitle>

              <div className="space-y-6">
                <AnimatedInput
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  delay={200}
                />

                <AnimatedInput
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  delay={300}
                />

                <AnimatedInput
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  delay={400}
                />

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div>
                    <label className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1 block">
                      Arrival Date
                    </label>
                    <AnimatedInput
                      type="date"
                      placeholder="Arrival"
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      delay={450}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1 block">
                      Check-out Date
                    </label>
                    <AnimatedInput
                      type="date"
                      placeholder="Check-out"
                      value={checkoutDate}
                      onChange={(e) => setCheckoutDate(e.target.value)}
                      delay={500}
                    />
                  </div>
                </div>

                {selectedPackage === "group" && (
                  <div className="grid grid-cols-2 gap-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                      <label className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-2 block">
                        Guests
                      </label>
                      <AnimatedSelect
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        options={[...Array(20).keys()].map((i) => i + 1)}
                        labelSuffix="People"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-2 block">
                        Cars
                      </label>
                      <AnimatedSelect
                        value={cars}
                        onChange={(e) => setCars(Number(e.target.value))}
                        options={[...Array(10).keys()].map((i) => i)}
                        labelSuffix="Cars"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <SectionTitle delay={600}>Choose Package</SectionTitle>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {packages.map((pkg, index) => (
                  <SelectCard
                    key={pkg.id}
                    selected={selectedPackage === pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    delay={700 + index * 100}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{pkg.icon}</span>
                      <div>
                        <h4 className="font-bold">{pkg.title}</h4>
                        <p className="text-orange-400 text-sm">{pkg.price}</p>
                      </div>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Receipt */}
          <div className="space-y-12 lg:sticky lg:top-10 bg-neutral-900/30 p-8 rounded-[2rem] border border-neutral-800 backdrop-blur-xl">
            <div>
              <SectionTitle delay={1000}>Payment Method</SectionTitle>

              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => (
                  <SelectCard
                    key={method.name}
                    selected={paymentMethod === method.name}
                    onClick={() => setPaymentMethod(method.name)}
                    delay={1100 + index * 100}
                  >
                    <div className="flex flex-col items-center py-2 gap-2">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest">
                        {method.name}
                      </span>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </div>

            {paymentMethod && (
              <div className="animate-in zoom-in-95 duration-500">
                <SectionTitle>Payment Confirmation</SectionTitle>

                {paymentMethod === "Cash" ? (
                  <div className="p-6 border-2 border-orange-500/30 bg-orange-500/5 rounded-2xl flex items-center gap-4">
                    <div className="text-3xl">⛪</div>
                    <p className="text-sm md:text-base text-orange-200 font-medium leading-relaxed">
                      Cash must be given in person at church.
                    </p>
                  </div>
                ) : (
                  <div className="group relative">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />

                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-neutral-700 rounded-2xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all"
                    >
                      <svg
                        className="w-8 h-8 mb-2 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <span className="text-sm text-neutral-400">
                        Click to upload screenshot
                      </span>

                      {fileName && (
                        <span className="mt-2 text-xs text-green-400 font-bold">
                          {fileName}
                        </span>
                      )}
                    </label>
                  </div>
                )}
              </div>
            )}

            <div className="pt-6 border-t border-neutral-800">
              <div className="flex justify-between items-center mb-6">
                <span className="text-neutral-400 font-medium">
                  Total Amount
                </span>

                <span className="text-3xl font-black text-orange-500">
                  {selectedPackage
                    ? packages.find((p) => p.id === selectedPackage)?.price
                    : "0 ETB"}
                </span>
              </div>

              <PrimaryButton
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Reservation"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;