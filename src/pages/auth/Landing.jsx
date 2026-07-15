import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Trophy,
  Activity,
  MessageSquare,
} from "lucide-react";
import Header from "../../components/shared/Header";

const featureCards = [
  {
    title: "Student collaboration",
    description: "Share progress, ask doubts, and keep projects moving with peers and faculty in real time.",
    icon: MessageSquare,
  },
  {
    title: "Faculty oversight",
    description: "Review submissions, approve records, and guide students from one clear dashboard.",
    icon: Users,
  },
  {
    title: "HOD insights",
    description: "Monitor campus activity, announcements, and analytics without switching tools.",
    icon: BarChart3,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 text-slate-800">
      <Header />

      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.16),_transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-6 sm:px-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Modern campus management for every role
            </div>
            <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-green-950 sm:text-5xl lg:text-6xl">
              Connect students, faculty, and leadership in one place.
            </h1>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
              Simplify communication, approvals, and growth with a polished platform designed for modern institutions.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-emerald-700"
              >
                Get started <ChevronRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl border border-emerald-200 bg-white px-8 py-4 font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                Login to portal
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="grid gap-6 md:grid-cols-3">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-emerald-100 bg-white/80 p-8 shadow-sm backdrop-blur"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-green-950">{title}</h3>
                <p className="text-sm leading-7 text-slate-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="rounded-[2rem] border border-emerald-100 bg-white/70 p-8 shadow-sm backdrop-blur lg:p-12">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <BrainCircuit className="h-4 w-4" />
                  Built for daily campus operations
                </div>
                <h2 className="mb-4 text-3xl font-bold text-green-950 sm:text-4xl">
                  A calmer, smarter way to manage academic collaboration.
                </h2>
                <p className="text-lg leading-8 text-slate-600">
                  From student engagement and faculty approvals to insights for HODs and leadership, the platform keeps the workflow connected and simple.
                </p>
              </div>
              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Campus overview</p>
                    <p className="text-xl font-bold text-green-950">Everything connected</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {[
                    ["Attendance & records", ShieldCheck],
                    ["Achievement tracking", Trophy],
                    ["Live announcements", Activity],
                  ].map(([label, Icon]) => (
                    <div key={label} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium text-slate-700">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 pt-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-12">
          <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] border border-emerald-100 bg-emerald-600 px-8 py-10 text-center text-white shadow-lg sm:flex-row sm:text-left">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-emerald-100">Ready to explore?</p>
              <h3 className="text-2xl font-bold">Start your journey with the campus platform today.</h3>
            </div>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Create account <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
