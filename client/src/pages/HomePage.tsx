import React, { useRef } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { AboutSection } from '../components/home/AboutSection';
import { EventsSection } from '../components/home/EventsSection';
import { TimelineSection } from '../components/home/TimelineSection';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { CommunitySection } from '../components/home/CommunitySection';
import { CoordinatorsSection } from '../components/home/CoordinatorsSection';

export const HomePage: React.FC = () => {
  const handleScrollToEvents = () => {
    const el = document.getElementById('events-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0607] text-[#F7F2F2] overflow-x-hidden">
      
      {/* 01. NAVIGATION + HERO */}
      <HeroSection onExploreEvents={handleScrollToEvents} />

      {/* 02. LATEST NEWS & METRICS */}
      <NewsSection />

      {/* 03. ABOUT LOGIN */}
      <AboutSection />

      {/* 05. EVENTS */}
      <EventsSection />

      {/* 06. TIMELINE */}
      <TimelineSection />

      {/* 07. DAY SPOTLIGHT / SCHEDULE */}
      <ScheduleSection />

      {/* 08. COMMUNITY / ALUMNI */}
      <CommunitySection />

      {/* 08b. LEADERSHIP / COORDINATORS */}
      <CoordinatorsSection />

    </div>
  );
};
export default HomePage;
