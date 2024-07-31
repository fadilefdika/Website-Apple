import { useRef, useState, useEffect } from 'react';
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const VideoCarousel = () => {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [video, setVideo] = useState({
    isEnd: false, // Menunjukkan apakah video sudah selesai diputar
    startPlay: false, // Menunjukkan apakah video sudah mulai diputar
    videoId: 0, // Menyimpan ID dari video yang sedang diputar
    isLastVideo: false, // Menunjukkan apakah video adalah video terakhir dalam carousel
    isPlaying: false, // Menunjukkan apakah video sedang diputar
  });

  // Destructuring state video untuk kemudahan akses
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;
  const [loadedData, SetLoadedData] = useState([]); // Menyimpan data yang dimuat

  // Hook untuk animasi GSAP
  useGSAP(() => {
    // Animasi untuk slider (carousel)
    gsap.to('#slider', {
      transform: `translateX(${-100 * videoId}%)`, // Menggeser slider sesuai videoId
      duration: 2, // Durasi animasi 2 detik
      ease: 'power2.inOut', // Menggunakan easing power2.inOut
    });

    // Animasi untuk video
    gsap.to('#video', {
      scrollTrigger: {
        trigger: '#video',
        toggleActions: 'restart none none none', // Mengatur aksi toggle
      },
      onComplete: () => {
        // Mengubah state ketika animasi selesai
        setVideo((pre) => ({ ...pre, startPlay: true, isPlaying: true }));
      },
    });
  }, [isEnd, videoId]); // Menjalankan hook ketika isEnd atau videoId berubah

  useEffect(() => {
    // Mengecek apakah data sudah dimuat lebih dari 3
    if (loadedData.length > 3) {
      // Mengecek apakah video sedang diputar
      if (!isPlaying) {
        videoRef.current[videoId].pause(); // Jika tidak, jeda video
      } else {
        startPlay && videoRef.current[videoId].play(); // Jika ya, putar video
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]); // Menjalankan efek ketika state terkait berubah

  // Fungsi untuk menangani metadata(informasi) video yang telah dimuat (informasi yang diperlukan dalam parameter e)
  const handleLoadedMetadata = (i, e) => {
    SetLoadedData((prev) => [...prev, e]);
  };

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      // Animasi progres video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress !== currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '4vw',
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: 'white',
            });
          }
        },

        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: '12px',
            });

            gsap.to(span[videoId], {
              backgroundColor: '#afafaf',
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }
      const animUpdate = () => {
        anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]); // Menjalankan efek ketika videoId atau startPlay berubah

  // Fungsi untuk menangani proses kontrol video
  const handleProcess = (type, i) => {
    switch (type) {
      case 'video-end':
        setVideo((prev) => ({ ...prev, isEnd: true, videoId: i + 1 }));
        break;
      case 'video-last':
        setVideo((pre) => ({ ...pre, isLastVideo: true }));
        break;
      case 'video-reset':
        setVideo((pre) => ({ ...pre, isLastVideo: false, videoId: 0 }));
        break;
      case 'play':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
        break;
      case 'pause':
        setVideo((pre) => ({ ...pre, isPlaying: !pre.isPlaying }));
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  muted
                  playsInline={true}
                  preload="auto"
                  ref={(el) => (videoRef.current[i] = el)}
                  onEnded={() => (i !== 3 ? handleProcess('video-end', i) : handleProcess('video-last'))}
                  onPlay={() => setVideo((prevVideo) => ({ ...prevVideo, isPlaying: true }))}
                  onLoadedMetadata={(e) => handleLoadedMetadata(i, e)}
                  className={`${list.id === 2 && 'translate-x-44'} pointer-events-none`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, i) => (
            <span key={i} ref={(el) => (videoDivRef.current[i] = el)} className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer">
              <span className="absolute h-full w-full rounded-full" ref={(el) => (videoSpanRef.current[i] = el)} />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlaying ? 'play' : 'pause'}
            onClick={isLastVideo ? () => handleProcess('video-reset') : !isPlaying ? () => handleProcess('play') : () => handleProcess('pause')}
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
