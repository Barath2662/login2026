import React from 'react';
import DriftWall from '../components/DriftWall';

const items = [
  { image: '/login_gallery/1.webp', title: 'Gallery Image 1' },
  { image: '/login_gallery/2.webp', title: 'Gallery Image 2' },
  { image: '/login_gallery/3.webp', title: 'Gallery Image 3' },
  { image: '/login_gallery/4.webp', title: 'Gallery Image 4' },
  { image: '/login_gallery/5.webp', title: 'Gallery Image 5' },
  { image: '/login_gallery/6.webp', title: 'Gallery Image 6' },
  { image: '/login_gallery/7.webp', title: 'Gallery Image 7' },
  { image: '/login_gallery/8.webp', title: 'Gallery Image 8' },
  { image: '/login_gallery/9.webp', title: 'Gallery Image 9' },
  { image: '/login_gallery/10.webp', title: 'Gallery Image 10' },
  { image: '/login_gallery/11.webp', title: 'Gallery Image 11' },
  { image: '/login_gallery/12.webp', title: 'Gallery Image 12' },
  { image: '/login_gallery/13.webp', title: 'Gallery Image 13' },
  { image: '/login_gallery/14.webp', title: 'Gallery Image 14' },
  { image: '/login_gallery/15.webp', title: 'Gallery Image 15' },
  { image: '/login_gallery/17.JPG', title: 'Gallery Image 17' },
  { image: '/login_gallery/18.webp', title: 'Gallery Image 18' },
  { image: '/login_gallery/19.webp', title: 'Gallery Image 19' },
  { image: '/login_gallery/20.webp', title: 'Gallery Image 20' },
];

export const GalleryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0607] pt-28 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#130c0e_1px,transparent_1px),linear-gradient(to_bottom,#130c0e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30 pointer-events-none" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(circle,_rgba(224,27,34,0.06)_0%,_transparent_70%)] pointer-events-none filter blur-3xl z-0" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="font-mono text-[10px] text-[#E01B22] font-black tracking-[0.3em] block uppercase">
            ✦ SYMPOSIUM ARCHIVES • 
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-[#F7F2F2] tracking-wider uppercase">
            LOGIN GALLERY
          </h1>
          <p className="text-xs sm:text-sm text-[#A79798] font-mono tracking-wide leading-relaxed">
            Visual archive of hackathon arenas, terminal operations, keynotes, and student coordination.
          </p>
        </div>

        <div style={{ height: 600 }}>
          <DriftWall
            items={items}
            columns={5}
            tileWidth={200}
            tileHeight={132}
            gap={18}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="#060010"
            radius={14}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
