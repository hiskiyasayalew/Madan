
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { getNewsItems } from "@/lib/newsActions";
import {
  Calendar,
  Clock,
  X,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

export default function NewsPage() {
  const { language } = useLanguage();
  const t = translations[language];

  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // Load news items safely.
  useEffect(() => {
    let isMounted = true;

    async function loadNews() {
      try {
        const data = await getNewsItems();

        if (isMounted) {
          setNews(Array.isArray(data) ? (data as NewsItem[]) : []);
        }
      } catch (error) {
        console.error("Failed to load news:", error);

        if (isMounted) {
          setNews([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadNews();

    return () => {
      isMounted = false;
    };
  }, []);

  // Prevent background scrolling and support Escape to close the modal.
  useEffect(() => {
    if (!selectedNews) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedNews(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedNews]);

  const closeModal = useCallback(() => {
    setSelectedNews(null);
  }, []);

  // Format dates without allowing invalid values to break rendering.
  const formatDate = (date: string, includeWeekday = false) => {
    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleDateString("en-US", {
      dateStyle: includeWeekday ? "full" : "medium",
    });
  };

  // Loading screen.
  if (loading) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
        <div className="animate-gradient-slow absolute inset-0 bg-gradient-to-br from-black via-orange-900/20 to-black" />

        <div
          className="relative z-10 h-12 w-12 animate-spin rounded-full border-2 border-orange-500 border-r-transparent"
          role="status"
          aria-label="Loading news"
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pb-20 text-white transition-colors duration-300">
      {/* BACKGROUND EFFECTS */}
      <div
        className="pointer-events-none fixed inset-0 animate-gradient-slow bg-gradient-to-br from-black via-orange-900/20 via-30% to-black"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none fixed inset-0 animate-gradient-slow-reverse bg-gradient-to-tr from-orange-500/5 via-transparent to-orange-500/5"
        aria-hidden="true"
      />

      {/* HEADER */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 pt-8">
        {/* Optional navigation */}
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 mx-auto mt-15 max-w-7xl px-6">
        {/* PAGE INTRODUCTION */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
            {t.news.titlePrefix}{" "}
            <span className="text-orange-500">
              {t.news.titleHighlight}
            </span>
          </h1>

          <p className="mt-3 max-w-xl text-sm font-medium text-gray-400">
            {t.news.subtitle}
          </p>
        </div>

        {/* NEWS LIST */}
        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen
              size={48}
              className="mb-4 text-gray-700"
              aria-hidden="true"
            />

            <p className="text-sm italic text-gray-500">
              {t.news.noNews}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <article
                key={item.id}
                className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-800 bg-[#1a1a1a]/90 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/50"
              >
                <button
                  type="button"
                  onClick={() => setSelectedNews(item)}
                  className="flex h-full w-full flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500"
                  aria-label={`${t.news.readMore}: ${item.title}`}
                >
                  {/* IMAGE */}
                  <div className="relative h-52 w-full overflow-hidden bg-gray-900">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-800 text-gray-600">
                        <BookOpen size={40} aria-hidden="true" />
                      </div>
                    )}

                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* CARD CONTENT */}
                  <div className="flex flex-grow flex-col p-6">
                    {/* DATE */}
                    <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      <Calendar
                        size={12}
                        className="text-orange-500"
                        aria-hidden="true"
                      />

                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    {/* TITLE */}
                    <h2 className="line-clamp-2 text-xl font-black leading-snug transition-colors duration-300 group-hover:text-orange-500">
                      {item.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p className="mt-3 line-clamp-3 flex-grow text-xs font-medium leading-relaxed text-gray-400">
                      {item.content}
                    </p>

                    {/* READ MORE */}
                    <div className="mt-6 flex items-center justify-between border-t border-gray-800 pt-4">
                      <span className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-orange-500 transition-all duration-300 group-hover:translate-x-2">
                        {t.news.readMore}

                        <ChevronRight
                          size={14}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/10 transition-colors duration-300 group-hover:bg-orange-500/20">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-500 transition-transform duration-300 group-hover:scale-150" />
                      </div>
                    </div>
                  </div>

                  {/* HOVER EFFECT */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5" />
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* NEWS DETAIL MODAL */}
      {selectedNews && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* BACKDROP */}
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/80 backdrop-blur-md"
            onClick={closeModal}
            aria-label="Close news details"
            tabIndex={-1}
          />

          {/* MODAL CONTENT */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="news-modal-title"
            className="animate-in fade-in zoom-in-95 relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-gray-800 bg-[#1a1a1a]/95 shadow-2xl duration-200"
          >
            {/* MODAL HEADER */}
            <div className="flex shrink-0 items-center justify-between border-b border-gray-800 bg-[#1a1a1a]/95 px-5 py-6 sm:px-8">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">
                <Clock size={14} aria-hidden="true" />

                <span>
                  {t.news.postedOn}{" "}
                  {formatDate(selectedNews.created_at, true)}
                </span>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 transition-colors duration-300 hover:bg-gray-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="space-y-6 overflow-y-auto p-5 sm:p-8">
              {selectedNews.image_url && (
                <div className="h-56 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-800 sm:h-72">
                  <img
                    src={selectedNews.image_url}
                    alt={selectedNews.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <h2
                id="news-modal-title"
                className="text-2xl font-black leading-tight text-white sm:text-3xl"
              >
                {selectedNews.title}
              </h2>

              <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-gray-300 md:text-base">
                {selectedNews.content}
              </p>
            </div>

            {/* MODAL FOOTER */}
            <div className="shrink-0 border-t border-gray-800 bg-black/50 px-5 py-5 text-right sm:px-8">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-600/20 transition-all duration-300 hover:scale-105 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {t.news.closePanel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BACKGROUND ANIMATIONS */}
      <style jsx>{`
        @keyframes gradientSlow {
          0% {
            background-position: 0% 50%;
          }

          50% {
            background-position: 100% 50%;
          }

          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes gradientSlowReverse {
          0% {
            background-position: 100% 50%;
          }

          50% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradientSlow 20s ease-in-out infinite;
        }

        .animate-gradient-slow-reverse {
          background-size: 400% 400%;
          animation: gradientSlowReverse 25s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-gradient-slow,
          .animate-gradient-slow-reverse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
