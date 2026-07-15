import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Users, ChevronRight, ChevronLeft, BarChart2,
  Award, BookOpen, Zap, RefreshCw, CheckCircle2,
  TrendingUp, Target, Clock, DollarSign, GraduationCap,
  CalendarDays, Building2, Plus,
} from "lucide-react";
import {
  setStep,
  updateFormData,
  fetchClubPrediction,
  resetPrediction,
  clearError,
} from "../../features/hod/clubPredictionSlice";

// ─── Static option lists ─────────────────────────────────────────────────────

const CLUB_TYPES = [
  { value: "co-curricular",    label: "Co-Curricular",    icon: Zap,          color: "blue"  },
  { value: "extra-curricular", label: "Extra-Curricular", icon: Award,        color: "purple"},
  { value: "academic",         label: "Academic",         icon: BookOpen,     color: "green" },
];

const ACTIVITY_TYPES = [
  { value: "technical",  label: "Technical",        desc: "Coding, AI, Robotics"         },
  { value: "creative",   label: "Creative",         desc: "Art, Music, Photography"      },
  { value: "sports",     label: "Sports & Fitness",  desc: "Games, Athletics, Yoga"       },
  { value: "social",     label: "Social & Cultural", desc: "Events, Drama, Cultural"      },
  { value: "research",   label: "Research",          desc: "Projects, Paper writing"      },
];

const MEETING_FREQ = [
  { value: "weekly",   label: "Weekly"   },
  { value: "biweekly", label: "Bi-Weekly"},
  { value: "monthly",  label: "Monthly"  },
  { value: "daily",    label: "Daily"    },
];

const TIME_COMMITMENT = [
  { value: "low",    label: "Low",    desc: "1–2 hrs / week" },
  { value: "medium", label: "Medium", desc: "3–5 hrs / week" },
  { value: "high",   label: "High",   desc: "6+ hrs / week"  },
];

const MEMBERSHIP_FEE = [
  { value: "free",   label: "Free",   desc: "No fee"          },
  { value: "low",    label: "Low",    desc: "₹100–500"        },
  { value: "medium", label: "Medium", desc: "₹500–2,000"      },
  { value: "high",   label: "High",   desc: "₹2,000+"         },
];

const MIN_CGPA = [
  { value: "0", label: "No Requirement" },
  { value: "5", label: "5.0+"           },
  { value: "6", label: "6.0+"           },
  { value: "7", label: "7.0+"           },
  { value: "8", label: "8.0+"           },
];

const TARGET_SEM = [
  { value: "all", label: "All Semesters" },
  { value: "1-2", label: "1st – 2nd (Freshers)"   },
  { value: "3-4", label: "3rd – 4th"              },
  { value: "5-6", label: "5th – 6th"              },
  { value: "7-8", label: "7th – 8th (Final Year)" },
];

// ─── Shared UI helpers ───────────────────────────────────────────────────────

const colorMap = {
  blue  : { card: "border-blue-400 bg-blue-50",   dot: "bg-blue-500",   text: "text-blue-700",   icon: "text-blue-600 bg-blue-100"   },
  purple: { card: "border-purple-400 bg-purple-50", dot: "bg-purple-500", text: "text-purple-700", icon: "text-purple-600 bg-purple-100"},
  green : { card: "border-green-400 bg-green-50", dot: "bg-green-500",  text: "text-green-700",  icon: "text-green-600 bg-green-100"  },
};

function OptionCard({ selected, onClick, children, extraClass = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
          : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/40"
        } ${extraClass}`}
    >
      {children}
    </button>
  );
}

function SelectChip({ value, label, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200
        ${selected
          ? "border-indigo-500 bg-indigo-500 text-white shadow"
          : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400"
        }`}
    >
      {label}
    </button>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepIndicator({ current }) {
  const steps = [
    { num: 1, label: "Club Details"  },
    { num: 2, label: "Questionnaire" },
    { num: 3, label: "Prediction"    },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((s, idx) => (
        <React.Fragment key={s.num}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${current > s.num  ? "bg-indigo-500 text-white"
                : current === s.num ? "bg-indigo-600 text-white ring-4 ring-indigo-200"
                                     : "bg-slate-100 text-slate-400"}`}
            >
              {current > s.num ? <CheckCircle2 size={18} /> : s.num}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap
              ${current === s.num ? "text-indigo-600" : "text-slate-400"}`}>
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`h-0.5 w-12 sm:w-20 mt-[-14px] mx-1 transition-all
              ${current > s.num ? "bg-indigo-400" : "bg-slate-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── Step 1 – Club Details ───────────────────────────────────────────────────

function Step1ClubDetails({ form, onChange, onNext }) {
  const canProceed = form.title.trim() && form.clubType;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Club Details</h2>
        <p className="text-sm text-slate-500 mt-1">
          Start by entering basic information about the new club.
        </p>
      </div>

      {/* Club Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Club Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="e.g. AI & Machine Learning Club"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="What will members do in this club?"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm resize-none"
        />
      </div>

      {/* Club Type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Club Category <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CLUB_TYPES.map(({ value, label, icon: Icon, color }) => {
            const c = colorMap[color];
            const sel = form.clubType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onChange({ clubType: value })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
                  ${sel ? `${c.card} border-current shadow-md` : "border-slate-200 bg-white hover:border-indigo-300"}`}
              >
                <span className={`p-2 rounded-lg ${sel ? c.icon : "text-slate-400 bg-slate-100"}`}>
                  <Icon size={20} />
                </span>
                <span className={`text-sm font-bold ${sel ? c.text : "text-slate-600"}`}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm
          hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
          transition-all flex items-center justify-center gap-2"
      >
        Next — Answer Questions <ChevronRight size={16} />
      </button>
    </div>
  );
}

// ─── Step 2 – HOD Questionnaire ──────────────────────────────────────────────

function QuestionBlock({ icon: Icon, title, children }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
          <Icon size={16} />
        </span>
        <span className="text-sm font-bold text-slate-700">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Step2Questionnaire({ form, onChange, onBack, onSubmit, loading }) {
  const canSubmit =
    form.activityType && form.meetingFrequency &&
    form.timeCommitment && form.membershipFee;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800">Club Questionnaire</h2>
        <p className="text-sm text-slate-500 mt-1">
          Answer 7 quick questions — the system uses these to predict which
          students are most likely to join <strong>{form.title || "your club"}</strong>.
        </p>
      </div>

      {/* Q1 – Primary Activity */}
      <QuestionBlock icon={Zap} title="1. What is the primary activity type?">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACTIVITY_TYPES.map(({ value, label, desc }) => (
            <OptionCard
              key={value}
              selected={form.activityType === value}
              onClick={() => onChange({ activityType: value })}
            >
              <p className="text-sm font-semibold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
            </OptionCard>
          ))}
        </div>
      </QuestionBlock>

      {/* Q2 – Meeting Frequency */}
      <QuestionBlock icon={CalendarDays} title="2. How often will the club meet?">
        <div className="flex flex-wrap gap-2">
          {MEETING_FREQ.map(({ value, label }) => (
            <SelectChip
              key={value}
              value={value}
              label={label}
              selected={form.meetingFrequency === value}
              onClick={(v) => onChange({ meetingFrequency: v })}
            />
          ))}
        </div>
      </QuestionBlock>

      {/* Q3 – Time Commitment */}
      <QuestionBlock icon={Clock} title="3. What is the expected weekly time commitment?">
        <div className="grid grid-cols-3 gap-2">
          {TIME_COMMITMENT.map(({ value, label, desc }) => (
            <OptionCard
              key={value}
              selected={form.timeCommitment === value}
              onClick={() => onChange({ timeCommitment: value })}
            >
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </OptionCard>
          ))}
        </div>
      </QuestionBlock>

      {/* Q4 – Membership Fee */}
      <QuestionBlock icon={DollarSign} title="4. What is the membership fee?">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MEMBERSHIP_FEE.map(({ value, label, desc }) => (
            <OptionCard
              key={value}
              selected={form.membershipFee === value}
              onClick={() => onChange({ membershipFee: value })}
            >
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </OptionCard>
          ))}
        </div>
      </QuestionBlock>

      {/* Q5 – Minimum CGPA */}
      <QuestionBlock icon={GraduationCap} title="5. Minimum CGPA required?">
        <div className="flex flex-wrap gap-2">
          {MIN_CGPA.map(({ value, label }) => (
            <SelectChip
              key={value}
              value={value}
              label={label}
              selected={form.minCgpa === value}
              onClick={(v) => onChange({ minCgpa: v })}
            />
          ))}
        </div>
      </QuestionBlock>

      {/* Q6 – Target Semester */}
      <QuestionBlock icon={Target} title="6. Which semesters are targeted?">
        <div className="flex flex-wrap gap-2">
          {TARGET_SEM.map(({ value, label }) => (
            <SelectChip
              key={value}
              value={value}
              label={label}
              selected={form.targetSemester === value}
              onClick={(v) => onChange({ targetSemester: v })}
            />
          ))}
        </div>
      </QuestionBlock>

      {/* Q7 – Target Department */}
      <QuestionBlock icon={Building2} title="7. Target department (optional)?">
        <input
          type="text"
          value={form.targetDept === "all" ? "" : form.targetDept}
          onChange={(e) =>
            onChange({ targetDept: e.target.value.trim() || "all" })
          }
          placeholder='Leave blank for all departments, or type e.g. "CSE"'
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
      </QuestionBlock>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-2 border-slate-200
            text-slate-600 font-semibold text-sm hover:border-slate-400 transition-all"
        >
          <ChevronLeft size={16} /> Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || loading}
          className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm
            hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed
            transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Predicting…
            </>
          ) : (
            <>
              <BarChart2 size={16} /> Predict Joiners
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Step 3 – Results ────────────────────────────────────────────────────────

function ConfidenceRing({ confidence }) {
  const pct    = Math.round(confidence * 100);
  const radius = 36;
  const circ   = 2 * Math.PI * radius;
  const dash   = (pct / 100) * circ;

  const color =
    pct >= 70 ? "#22c55e" : pct >= 45 ? "#6366f1" : "#f59e0b";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" className="-rotate-90">
        <circle cx="48" cy="48" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
        <circle
          cx="48" cy="48" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-slate-800">{pct}%</span>
        <span className="text-[10px] font-semibold text-slate-500 uppercase">confidence</span>
      </div>
    </div>
  );
}

function TopStudentRow({ student, rank }) {
  const barWidth = Math.round(student.probability * 100);
  const barColor =
    barWidth >= 70 ? "bg-emerald-500" :
    barWidth >= 45 ? "bg-indigo-500"  : "bg-amber-400";

  return (
    <div className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
      <span className="w-6 text-xs font-black text-slate-400 shrink-0">#{rank}</span>
      {student.profileImage ? (
        <img
          src={student.profileImage}
          alt={student.fullname}
          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-indigo-600">
            {student.fullname?.[0] || "?"}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{student.fullname}</p>
        <p className="text-xs text-slate-500">{student.dept} · Sem {student.semester}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-xs font-bold text-slate-700">{barWidth}%</span>
        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor} transition-all duration-700`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function Step3Results({ data, clubForm, onReset, onBack, onCreateClub }) {
  const { predictedStudents, confidence, topStudents, breakdown, totalStudentsFetched } = data;
  const confPct = Math.round((confidence || 0) * 100);

  const confLabel =
    confPct >= 70 ? { text: "High Confidence",   color: "text-emerald-600 bg-emerald-50 border-emerald-200" } :
    confPct >= 45 ? { text: "Medium Confidence",  color: "text-indigo-600  bg-indigo-50  border-indigo-200"  } :
                   { text: "Low Confidence",    color: "text-amber-600  bg-amber-50   border-amber-200"   };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-3">
          <TrendingUp size={13} /> Prediction Result
        </div>
        <h2 className="text-xl font-black text-slate-800">{clubForm.title || "Your Club"}</h2>
        <p className="text-sm text-slate-500 mt-1 capitalize">
          {clubForm.clubType} · {data.clubInfo?.activityType || clubForm.activityType}
        </p>
      </div>

      {/* Main stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Predicted joiners */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-5 text-white shadow-lg shadow-indigo-200 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 rounded-lg bg-white/20">
              <Users size={16} />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">
              Predicted Joiners
            </span>
          </div>
          <p className="text-5xl font-black">{predictedStudents}</p>
          <p className="text-xs opacity-70 mt-2">
            out of {totalStudentsFetched} students analysed
          </p>
        </div>

        {/* Confidence ring */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow p-5 flex flex-col items-center justify-center gap-3">
          <ConfidenceRing confidence={confidence || 0} />
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${confLabel.color}`}>
            {confLabel.text}
          </span>
        </div>
      </div>

      {/* Breakdown */}
      {breakdown && (
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Student Breakdown
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Eligible",     val: breakdown.eligible,     color: "text-slate-700"   },
              { label: "Likely Join",  val: breakdown.likelyToJoin, color: "text-emerald-600" },
              { label: "Unlikely",     val: breakdown.unlikely,     color: "text-amber-600"   },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                <p className={`text-2xl font-black ${color}`}>{val}</p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top 10 students */}
      {topStudents && topStudents.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
            <Award size={15} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-700">
              Top {topStudents.length} Students Likely to Join
            </span>
          </div>
          <div className="px-5 py-2">
            {topStudents.map((student, i) => (
              <TopStudentRow key={student.studentid} student={student} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-5 py-3 rounded-xl border-2 border-slate-200
            text-slate-600 font-semibold text-sm hover:border-slate-400 transition-all"
        >
          <ChevronLeft size={16} /> Edit
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-3 rounded-xl border-2 border-indigo-200 text-indigo-700 font-bold text-sm
            hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={15} /> Predict Another
        </button>
        <button
          type="button"
          onClick={onCreateClub}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold text-sm
            hover:from-teal-700 hover:to-teal-800 transition-all flex items-center justify-center gap-2 shadow-md shadow-teal-200"
        >
          <Plus size={15} /> Create Club Now
        </button>
      </div>
    </div>
  );
}

// ─── Root Component ──────────────────────────────────────────────────────────

const CreateClubPredictor = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const {
    step, formData, loading, error,
    predictedStudents, confidence, topStudents,
    breakdown, totalStudentsFetched, clubInfo,
  } = useSelector((state) => state.clubPrediction);

  useEffect(() => {
    return () => {
      dispatch(resetPrediction());
    };
  }, [dispatch]);

  const handleChange = (updates) => {
    dispatch(clearError());
    dispatch(updateFormData(updates));
  };

  const handleNext = () => dispatch(setStep(2));
  const handleBack = () => dispatch(setStep(step - 1));

  const handleSubmit = () => {
    dispatch(fetchClubPrediction(formData));
  };

  const handleReset      = () => dispatch(resetPrediction());
  const handleCreateClub = () => navigate("/hod/clubs");

  const resultData = {
    predictedStudents,
    confidence,
    topStudents,
    breakdown,
    totalStudentsFetched,
    clubInfo,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">

        {/* Page title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-4">
            <BarChart2 size={14} /> Club Joiner Predictor
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
            How many students will join?
          </h1>
          <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Answer a few questions before creating your club — the system
            analyses student data and predicts expected joiners instantly.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-6 sm:p-8">
          <StepIndicator current={step} />

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700 font-semibold">{error}</p>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-auto text-red-500 hover:text-red-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {step === 1 && (
            <Step1ClubDetails
              form={formData}
              onChange={handleChange}
              onNext={handleNext}
            />
          )}

          {step === 2 && (
            <Step2Questionnaire
              form={formData}
              onChange={handleChange}
              onBack={handleBack}
              onSubmit={handleSubmit}
              loading={loading}
            />
          )}

          {step === 3 && (
            <Step3Results
              data={resultData}
              clubForm={formData}
              onReset={handleReset}
              onBack={handleBack}
              onCreateClub={handleCreateClub}
            />
          )}
        </div>

        {/* Footer hint */}
        {step !== 3 && (
          <p className="text-center text-xs text-slate-400 mt-5">
            No ML training required — prediction is instant using student academic data.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateClubPredictor;
