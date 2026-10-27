import React, { useState } from "react";
import { 
  Disc, 
  ExternalLink, 
  Youtube, 
  Music2,
  Calendar,
  ArrowRight,
  Info,
  Activity
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../lib/translations";

// ============================================
// TYPES - Embedded directly
// ============================================
export interface AlbumTrack {
  trackNo: number;
  title: string;
  amharicTitle: string;
  duration: string;
  artist: string;
  description: string;
}

export interface Album {
  id: string;
  title: string;
  amharicTitle: string;
  releaseYear: number;
  tracksCount: number;
  tracks: AlbumTrack[];
  description: string;
  youtubeUrl: string;
  youtubeVideoId: string;
}

// ============================================
// DATA - 2 Albums with complete 12-track listings
// ============================================
const ALBUMS_DATA: Album[] = [
  {
    id: "sacred-journeys",
    title: "Sacred Journeys (Live in Addis)",
    amharicTitle: "ቅዱስ ጉዞዎች",
    releaseYear: 2024,
    tracksCount: 12,
    description: "A powerful live recording capturing the essence of Ethiopian sacred choral tradition with full orchestra.",
    youtubeUrl: "https://www.youtube.com/watch?v=mnxUCdAWWgY",
    youtubeVideoId: "mnxUCdAWWgY",
    tracks: [
      {
        trackNo: 1,
        title: "Alemu Genet",   
        amharicTitle: "አለሙ ገነት",
        duration: "4:32",
        artist: "Madan Choir",
        description: "A triumphant opening piece celebrating divine grace and salvation."
      },
      {
        trackNo: 2,
        title: "Yetemheru Zema",
        amharicTitle: "የተማሩ ዜማ",
        duration: "5:18",
        artist: "Madan Choir",
        description: "Traditional liturgical chant arranged for mixed choir."
      },
      {
        trackNo: 3,
        title: "Kidist Selassie",
        amharicTitle: "ቅድስት ሥላሴ",
        duration: "6:45",
        artist: "Madan Choir",
        description: "A meditative piece honoring the Holy Trinity."
      },
      {
        trackNo: 4,
        title: "Meskel Adey",
        amharicTitle: "መስቀል አደይ",
        duration: "4:58",
        artist: "Madan Choir",
        description: "Celebrating the finding of the True Cross."
      },
      {
        trackNo: 5,
        title: "Temari Bet",
        amharicTitle: "ተማሪ ቤት",
        duration: "5:22",
        artist: "Madan Choir",
        description: "A student anthem about spiritual education."
      },
      {
        trackNo: 6,
        title: "Yegena Chewata",
        amharicTitle: "የገና ጨዋታ",
        duration: "4:15",
        artist: "Madan Choir",
        description: "Joyful Christmas celebration piece."
      },
      {
        trackNo: 7,
        title: "Sefatan Zare",
        amharicTitle: "ሰፋታን ዛሬ",
        duration: "5:45",
        artist: "Madan Choir",
        description: "A prayer for peace and reconciliation."
      },
      {
        trackNo: 8,
        title: "Andinet",
        amharicTitle: "አንድነት",
        duration: "4:30",
        artist: "Madan Choir",
        description: "Unity anthem calling for togetherness in faith."
      },
      {
        trackNo: 9,
        title: "Tinsae",
        amharicTitle: "ትንሳኤ",
        duration: "6:12",
        artist: "Madan Choir",
        description: "Easter resurrection celebration."
      },
      {
        trackNo: 10,
        title: "Mariamite",
        amharicTitle: "ማሪያማዊት",
        duration: "5:05",
        artist: "Madan Choir",
        description: "Devotional piece honoring the Virgin Mary."
      },
      {
        trackNo: 11,
        title: "Egziabher Negus",
        amharicTitle: "እግዚአብሔር ንጉሥ",
        duration: "4:55",
        artist: "Madan Choir",
        description: "A majestic proclamation of God's kingship."
      },
      {
        trackNo: 12,
        title: "Selamta",
        amharicTitle: "ሰላምታ",
        duration: "5:30",
        artist: "Madan Choir",
        description: "Closing benediction piece blessing the congregation."
      }
    ]
  },
  {
    id: "hatieaner-berku",
    title: "አዲስ ሰማይ",
    amharicTitle: "Adis Semay",
    releaseYear: 2020,
    tracksCount: 12,
    description: "A powerful 12-track collection of repentance and redemption hymns celebrating God's mercy and forgiveness.",
    youtubeUrl: "https://www.youtube.com/watch?v=d6qs7q9CKkY&list=PLnkMvqMGmRVV8WUyiwcQz_-LpUL5tU17i",
    youtubeVideoId: "d6qs7q9CKkY",
    tracks: [
      {
        trackNo: 1,
        title: "ኃጢአተኛ ነበርኩ",
        amharicTitle: "Hatieaner Berku",
        duration: "5:01",
        artist: "Madan Choir",
        description: "A powerful confession of sin and testimony of God's transforming grace."
      },
      {
        trackNo: 2,
        title: "ከአንተ ወዴት",
        amharicTitle: "Ke ante Wedet",
        duration: "5:37",
        artist: "Madan Choir",
        description: "Celebrating the sufficiency of God's mercy and forgiveness."
      },
      {
        trackNo: 3,
        title: "አመልክሃለሁ",
        amharicTitle: "Amelkehalew",
        duration: "5:21",
        artist: "Madan Choir",
        description: "A beautiful piece about being refined like gold through trials."
      },
      {
        trackNo: 4,
        title: "ይገርመኛል",
        amharicTitle: "yegermegnal",
        duration: "4:04",
        artist: "Madan Choir",
        description: "Walking humbly with God in faith and obedience."
      },
      {
        trackNo: 5,
        title: "ብቻህን ተዓምራት",
        amharicTitle: "Bichahn Tamerat",
        duration: "5:06",
        artist: "Madan Choir",
        description: "A call to repentance and returning to God's loving embrace."
      },
      {
        trackNo: 6,
        title: "ስሙ ኢየሱስ",
        amharicTitle: "Simu Eyesus",
        duration: "5:18",
        artist: "Madan Choir",
        description: "Acknowledging that God's grace is more than enough."
      },
      {
        trackNo: 7,
        title: "ጌታ ሲል",
        amharicTitle: "Geta sil",
        duration: "3:36",
        artist: "Madan Choir",
        description: "Edit this track description."
      },
      {
        trackNo: 8,
        title: "ምስጋና ነው ድሌ",
        amharicTitle: "Misgana new Dile",
        duration: "4:34",
        artist: "Madan Choir",
        description: "Edit this track description."
      },
      {
        trackNo: 9,
        title: "ያልጠፋሁት",
        amharicTitle: "Yaltefahut",
        duration: "4:23",
        artist: "Madan Choir",
        description: "Edit this track description."
      },
      {
        trackNo: 10,
        title: "አዲስ ሰማይ",
        amharicTitle: "Adis Semay",
        duration: "2:32",
        artist: "Madan Choir",
        description: "Edit this track description."
      },
      {
        trackNo: 11,
        title: "ተግቼ እፈልጋለሁ",
        amharicTitle: "Tegeche Efelegalew",
        duration: "5:39",
        artist: "Madan Choir",
        description: "Edit this track description."
      },
      {
        trackNo: 12,
        title: "ሰውን ሁሉ የሚያድን",
        amharicTitle: "Sewn Hulu Yemiadn",
        duration: "4:32",
        artist: "Madan Choir",
        description: "Edit this track description."
      }
    ]
  }
];

// ============================================
// MAIN COMPONENT - Standalone with full-width YouTube & color theme
// ============================================
export default function AlbumsList() {
  const { language } = useLanguage();
  const t = translations[language];
  
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>(ALBUMS_DATA[0].id);
  const [activeTrackNo, setActiveTrackNo] = useState<number>(1);
  const [simulatedPlaying, setSimulatedPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(35);

  const selectedAlbum = ALBUMS_DATA.find(a => a.id === selectedAlbumId) || ALBUMS_DATA[0];
  const activeTrack = selectedAlbum.tracks.find(t => t.trackNo === activeTrackNo) || selectedAlbum.tracks[0];

  // Helper simulated progress bar increment (just aesthetic)
  React.useEffect(() => {
    let interval: number;
    if (simulatedPlaying) {
      interval = window.setInterval(() => {
        setPlayProgress(p => (p >= 100 ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [simulatedPlaying]);

  return (
    <div className="bg-black rounded-3xl border border-gray-800 p-6 md:p-10 relative overflow-hidden font-['Montserrat']" id="sacred-albums-showcase">
      {/* Background Soft Gradiation */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      {/* Segment Header - TRANSLATED SECTION */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900/40 text-orange-500 rounded-full text-xs font-mono tracking-widest uppercase mb-4 border border-orange-500/15 shadow-sm">
          <Disc className="w-3.5 h-3.5 fill-orange-500/30 animate-spin" style={{ animationDuration: '6s' }} /> {t.albumsList.badge}
        </div>
        <h2 className="font-['Montserrat'] text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          {t.albumsList.title}
        </h2>
        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed font-['Montserrat']">
          {t.albumsList.description}
        </p>
      </div>

      {/* FULL WIDTH YouTube Window - MOVED TO TOP */}
      <div className="mb-10">
        <div 
          onClick={() => window.open(selectedAlbum.youtubeUrl, "_blank", "noopener,noreferrer")}
          className="bg-gray-900/30 rounded-2xl border border-gray-800 p-6 md:p-8 relative cursor-pointer hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(255,107,0,0.15)] group transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/80 rounded text-[10px] font-mono text-amber-400 border border-orange-500/10">
                <Calendar className="w-3 h-3" /> Released in {selectedAlbum.releaseYear}
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-500 uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Watch on YouTube
            </span>
          </div>

          {/* Full Width Embedded YouTube Video */}
          <div className="relative rounded-xl overflow-hidden border border-gray-800 aspect-video bg-black/60 group-hover:border-orange-500/40 transition-colors shadow-2xl">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedAlbum.youtubeVideoId}?autoplay=0&rel=0`}
              title="Madan Choir Performance"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>

      {/* Album Selector Tabs - MOVED TO BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10" id="album-tabs-grid">
        {ALBUMS_DATA.map((album, idx) => {
          const isSelected = album.id === selectedAlbumId;
          return (
            <button
              key={album.id}
              onClick={() => {
                setSelectedAlbumId(album.id);
                setActiveTrackNo(1);
                setPlayProgress(20);
              }}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between group transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? "bg-gray-900/80 border-orange-500 text-white shadow-xl"
                  : "bg-black/40 border-gray-800/50 hover:border-gray-800/85 text-gray-400"
              }`}
              id={`album-tab-${album.id}`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className="text-[10px] font-mono tracking-wider text-orange-500 font-bold uppercase">
                  RECORDING 0{idx + 1}
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {album.releaseYear}
                </span>
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
                  {album.title.split(" (")[0]}
                </h3>
                <span className="text-xs text-amber-500 font-['Montserrat'] italic mt-0.5 block">
                  {album.amharicTitle}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between w-full text-[11px] font-mono border-t border-gray-800/40 pt-3">
                <span>{album.tracksCount} Stereo Tracks</span>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  EXPLORE <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Track List Section - Full width */}
      <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800/50 mb-4">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-mono text-gray-400 font-bold block">
              Stereo Track List ({selectedAlbum.tracks.length} tracks total)
            </span>
            <span className="text-xs font-['Montserrat'] text-orange-400 italic mt-1 block">
              Performed by Madan Choir
            </span>
          </div>
          <Music2 className="w-5 h-5 text-orange-500" />
        </div>

        {/* Track entries with dynamic hover selection */}
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {selectedAlbum.tracks.map((track) => {
            const isActive = track.trackNo === activeTrackNo;
            return (
              <button
                key={track.trackNo}
                onClick={() => {
                  setActiveTrackNo(track.trackNo);
                  setSimulatedPlaying(true);
                  setPlayProgress(0);
                  window.open(selectedAlbum.youtubeUrl, "_blank", "noopener,noreferrer");
                }}
                className={`w-full py-3 px-4 rounded-xl flex items-center justify-between text-left group border transition-all duration-250 ${
                  isActive
                    ? "bg-gray-800/50 border-orange-500/40 text-white"
                    : "bg-transparent border-transparent hover:border-gray-800/50 hover:bg-gray-800/20 text-gray-400 hover:text-white"
                }`}
                id={`album-track-${track.trackNo}`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <span className={`text-sm font-mono w-8 text-center font-bold ${isActive ? "text-orange-500" : "text-gray-500"}`}>
                    {isActive && simulatedPlaying ? (
                      <span className="flex gap-0.5 justify-center items-end h-4 w-5">
                        <span className="w-0.5 h-2.5 bg-orange-500 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
                        <span className="w-0.5 h-1.5 bg-orange-500 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.3s' }} />
                        <span className="w-0.5 h-3 bg-orange-500 animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.2s' }} />
                      </span>
                    ) : (
                      `${track.trackNo.toString().padStart(2, '0')}`
                    )}
                  </span>
                  
                  <div className="flex-1">
                    <span className={`text-sm font-semibold font-['Montserrat'] block ${isActive ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                      {track.title}
                    </span>
                    <span className="text-[11px] text-gray-500 block font-['Montserrat']">
                      {track.amharicTitle} • {track.artist}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-gray-500 font-medium">
                    {track.duration}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    PLAY
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom CSS for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #FF6B00, #FFA500, #D4AF37);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #FF6B00;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin {
          animation: spin 6s linear infinite;
        }
      `}</style>
    </div>
  );
}