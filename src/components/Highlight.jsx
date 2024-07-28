import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { watchImg, rightImg } from '../utils';
import VideoCarousel from './VideoCarousel';

const Highlight = () => {
  useGSAP(() => {
    gsap.to('#highlight-title', { opacity: 1, duration: 0.5, y: 0 });
    gsap.to('.link', { opacity: 1, duration: 0.5, y: 0, stagger: 0.3 });
  });

  return (
    <section id="highlight" className="w-screen overflow-hidden h-full common-padding bg-zinc">
      <div className="screen-max-width">
        <div className="mb-12 w-full md:flex items-end justify-between">
          <h1 id="highlight-title" className="section-heading">
            Get the highlights.
          </h1>

          <div className="flex flex-wrap items-end gap-5">
            <p className="link">
              Watch the film <img src={watchImg} alt="watchImg" className="ml-2" />
            </p>
            <p className="link">
              Watch the event <img src={rightImg} alt="rightImg" className="ml-2" />
            </p>
          </div>
        </div>

        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlight;
