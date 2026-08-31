import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { NewsSection } from '../components/home/NewsSection';
import { AboutSection } from '../components/home/AboutSection';
import { EventsSection } from '../components/home/EventsSection';
import { TimelineSection } from '../components/home/TimelineSection';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { CommunitySection } from '../components/home/CommunitySection';
import { CoordinatorsSection } from '../components/home/CoordinatorsSection';
import { ScrollReveal } from '../animations/ScrollReveal';

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
      <ScrollReveal direction="none" duration={1.2}>
        <HeroSection onExploreEvents={handleScrollToEvents} />
      </ScrollReveal>

      {/* 02. LATEST NEWS & METRICS */}
      <ScrollReveal direction="up" delay={0.2}>
        <NewsSection />
      </ScrollReveal>

      {/* 03. ABOUT LOGIN */}
      <ScrollReveal direction="up" amount={0.3}>
        <AboutSection />
      </ScrollReveal>

      {/* 05. EVENTS */}
      <ScrollReveal direction="up" amount={0.1}>
        <EventsSection />
      </ScrollReveal>

      {/* 06. TIMELINE */}
      <ScrollReveal direction="up" amount={0.2}>
        <TimelineSection />
      </ScrollReveal>

      {/* 07. DAY SPOTLIGHT / SCHEDULE */}
      <ScrollReveal direction="up" amount={0.2}>
        <ScheduleSection />
      </ScrollReveal>

      {/* 08. COMMUNITY / ALUMNI */}
      <ScrollReveal direction="up" amount={0.2}>
        <CommunitySection />
      </ScrollReveal>

      {/* 08b. LEADERSHIP / COORDINATORS */}
      <ScrollReveal direction="up" amount={0.2}>
        <CoordinatorsSection isHomePage={true} />
      </ScrollReveal>

    </div>
  );
};
export default HomePage;
