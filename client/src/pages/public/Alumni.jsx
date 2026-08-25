import React from 'react';
import { Link } from 'react-router-dom';

const Alumni = () => {
  return (
    <div className="bg-bg-primary min-h-[50vh] flex flex-col justify-center border-t border-border-color">
      <section className="py-20 px-4 sm:px-8 lg:px-12 bg-bg-card text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="font-mono text-xs font-bold text-color-red tracking-widest uppercase">
              PSG TECH MCA ALUMNI INVITATION
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white">
              WELCOME HOME, ALUMNI
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Reconnect with past batches, network with current students, and witness the 35th edition of LOGIN on 18 & 19 September 2026.
            </p>
          </div>

          <Link
            to="/register?type=alumni"
            className="px-8 py-4 bg-color-red hover:bg-color-danger text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] shrink-0 shadow-lg"
          >
            ALUMNI REGISTRATION FORM →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Alumni;
