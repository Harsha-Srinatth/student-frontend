import React, { useState, useEffect } from 'react';
import { TrendingUp, GraduationCap, Award, BookOpen, Star, BarChart3, Target } from 'lucide-react';

const Credits = () => {
  const [currentCGPA, setCurrentCGPA] = useState(0);
  const [currentSGPA, setCurrentSGPA] = useState(0);
  const [animatedCGPA, setAnimatedCGPA] = useState(0);
  const [animatedSGPA, setAnimatedSGPA] = useState(0);

  // Semester data with realistic academic progression - attractive soft colors
  const semesterData = [
    { semester: 'Sem 1', credits: 24, gpa: 7.8, color: 'from-sky-400 to-blue-500' },
    { semester: 'Sem 2', credits: 26, gpa: 8.2, color: 'from-violet-400 to-purple-500' },
    { semester: 'Sem 3', credits: 28, gpa: 8.6, color: 'from-emerald-400 to-teal-500' },
    { semester: 'Sem 4', credits: 30, gpa: 8.9, color: 'from-amber-400 to-orange-500' }
  ];

  // Generate random CGPA and SGPA
  useEffect(() => {
    const randomCGPA = Math.random() * 2 + 7.5; // 7.5 to 9.5
    const randomSGPA = Math.random() * 2 + 7.5; // 7.5 to 9.5
    
    setCurrentCGPA(randomCGPA);
    setCurrentSGPA(randomSGPA);

    // Animate the values
    setTimeout(() => {
      setAnimatedCGPA(randomCGPA);
      setAnimatedSGPA(randomSGPA);
    }, 500);
  }, []);

  // Calculate total credits
  const totalCredits = semesterData.reduce((sum, sem) => sum + sem.credits, 0);

  // Get grade classification - softer, more attractive colors
  const getGradeClassification = (gpa) => {
    if (gpa >= 9.0) return { grade: 'O', color: 'text-emerald-700', bg: 'bg-emerald-50' };
    if (gpa >= 8.5) return { grade: 'A+', color: 'text-sky-700', bg: 'bg-sky-50' };
    if (gpa >= 8.0) return { grade: 'A', color: 'text-indigo-700', bg: 'bg-indigo-50' };
    if (gpa >= 7.5) return { grade: 'B+', color: 'text-violet-700', bg: 'bg-violet-50' };
    if (gpa >= 7.0) return { grade: 'B', color: 'text-amber-700', bg: 'bg-amber-50' };
    return { grade: 'C+', color: 'text-rose-700', bg: 'bg-rose-50' };
  };

  const cgpaGrade = getGradeClassification(currentCGPA);
  const sgpaGrade = getGradeClassification(currentSGPA);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl text-white shadow-lg">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Academic Performance</h3>
            <p className="text-sm text-gray-500">4 Semesters Progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200">
          <Award className="w-4 h-4" />
          {totalCredits} Credits
        </div>
      </div>

      {/* CGPA and SGPA Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current CGPA */}
        <div className="relative p-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl border border-sky-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${cgpaGrade.bg} ${cgpaGrade.color} border border-slate-200`}>
              {cgpaGrade.grade}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-500 rounded-lg text-white shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800">Current CGPA</h4>
              <p className="text-sm text-slate-600">Cumulative Grade Point</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-slate-800 mb-2">
              {animatedCGPA.toFixed(2)}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
              <div 
                className="bg-gradient-to-r from-sky-400 to-blue-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${(animatedCGPA / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">Out of 10.0</p>
          </div>
        </div>

        {/* Current SGPA */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-sm hover:shadow-md transition-all duration-200">
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${sgpaGrade.bg} ${sgpaGrade.color} border border-slate-200`}>
              {sgpaGrade.grade}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg text-white shadow-md">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-slate-800">Current SGPA</h4>
              <p className="text-sm text-slate-600">Semester Grade Point</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-slate-800 mb-2">
              {animatedSGPA.toFixed(2)}
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${(animatedSGPA / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">Out of 10.0</p>
          </div>
        </div>
      </div>

      {/* Semester Progress Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h4 className="text-lg font-semibold text-gray-800">Semester-wise Growth</h4>
        </div>

        <div className="space-y-4">
          {semesterData.map((sem, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${sem.color}`}></div>
                  <span className="font-medium text-gray-700">{sem.semester}</span>
                  <span className="text-sm text-gray-500">({sem.credits} credits)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">{sem.gpa}</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getGradeClassification(sem.gpa).bg} ${getGradeClassification(sem.gpa).color}`}>
                    {getGradeClassification(sem.gpa).grade}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${sem.color} rounded-full transition-all duration-1000 ease-out transform hover:scale-y-110`}
                    style={{ 
                      width: `${(sem.gpa / 10) * 100}%`,
                      transitionDelay: `${index * 200}ms`
                    }}
                  ></div>
                </div>
                
                {/* Animated dots on progress bar */}
                <div 
                  className="absolute top-0 w-2 h-3 bg-white rounded-full shadow-lg transform -translate-y-0.5 transition-all duration-1000 ease-out"
                  style={{ 
                    left: `calc(${(sem.gpa / 10) * 100}% - 4px)`,
                    transitionDelay: `${index * 200}ms`
                  }}
                ></div>
              </div>

              {/* Growth indicator */}
              {index > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {sem.gpa > semesterData[index - 1].gpa ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-green-600 font-medium">
                        +{(sem.gpa - semesterData[index - 1].gpa).toFixed(1)}
                      </span>
                    </>
                  ) : sem.gpa < semesterData[index - 1].gpa ? (
                    <>
                      <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />
                      <span className="text-xs text-red-600 font-medium">
                        -{(semesterData[index - 1].gpa - sem.gpa).toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <>
                      <Target className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600 font-medium">Same</span>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-slate-700">
              {semesterData[semesterData.length - 1].gpa}
            </div>
            <div className="text-sm text-slate-600">Latest GPA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {((semesterData[semesterData.length - 1].gpa - semesterData[0].gpa) / semesterData[0].gpa * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600">Improvement</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-violet-600">
              {totalCredits}
            </div>
            <div className="text-sm text-slate-600">Total Credits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">
              {semesterData.length}
            </div>
            <div className="text-sm text-slate-600">Semesters</div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200 shadow-sm">
        <p className="text-sm text-slate-700 text-center font-medium">
          {currentCGPA >= 8.5 
            ? "🎉 Excellent performance! You're on track for great opportunities!"
            : currentCGPA >= 8.0
            ? "👏 Great work! Keep up the momentum for even better results!"
            : currentCGPA >= 7.5
            ? "📈 Good progress! Focus on consistent improvement!"
            : "💪 Keep working hard! Every step forward counts!"
          }
        </p>
      </div>
    </div>
  );
};

export default Credits;
