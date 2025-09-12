import React, { useState, useEffect } from 'react';
import { TrendingUp, GraduationCap, Award, BookOpen, Star, BarChart3, Target } from 'lucide-react';

const Credits = () => {
  const [currentCGPA, setCurrentCGPA] = useState(0);
  const [currentSGPA, setCurrentSGPA] = useState(0);
  const [animatedCGPA, setAnimatedCGPA] = useState(0);
  const [animatedSGPA, setAnimatedSGPA] = useState(0);

  // Semester data with realistic academic progression
  const semesterData = [
    { semester: 'Sem 1', credits: 24, gpa: 7.8, color: 'from-blue-500 to-cyan-500' },
    { semester: 'Sem 2', credits: 26, gpa: 8.2, color: 'from-purple-500 to-pink-500' },
    { semester: 'Sem 3', credits: 28, gpa: 8.6, color: 'from-green-500 to-emerald-500' },
    { semester: 'Sem 4', credits: 30, gpa: 8.9, color: 'from-orange-500 to-red-500' }
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

  // Get grade classification
  const getGradeClassification = (gpa) => {
    if (gpa >= 9.0) return { grade: 'O', color: 'text-green-600', bg: 'bg-green-100' };
    if (gpa >= 8.5) return { grade: 'A+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (gpa >= 8.0) return { grade: 'A', color: 'text-indigo-600', bg: 'bg-indigo-100' };
    if (gpa >= 7.5) return { grade: 'B+', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (gpa >= 7.0) return { grade: 'B', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { grade: 'C+', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const cgpaGrade = getGradeClassification(currentCGPA);
  const sgpaGrade = getGradeClassification(currentSGPA);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Academic Performance</h3>
            <p className="text-sm text-gray-500">4 Semesters Progress</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
          <Award className="w-4 h-4" />
          {totalCredits} Credits
        </div>
      </div>

      {/* CGPA and SGPA Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current CGPA */}
        <div className="relative p-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200">
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${cgpaGrade.bg} ${cgpaGrade.color}`}>
              {cgpaGrade.grade}
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-800">Current CGPA</h4>
              <p className="text-sm text-blue-600">Cumulative Grade Point</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">
              {animatedCGPA.toFixed(2)}
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(animatedCGPA / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 mt-2">Out of 10.0</p>
          </div>
        </div>

        {/* Current SGPA */}
        <div className="relative p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl border border-green-200">
          <div className="absolute top-4 right-4">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${sgpaGrade.bg} ${sgpaGrade.color}`}>
              {sgpaGrade.grade}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500 rounded-lg text-white">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-green-800">Current SGPA</h4>
              <p className="text-sm text-green-600">Semester Grade Point</p>
            </div>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-green-800 mb-2">
              {animatedSGPA.toFixed(2)}
            </div>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(animatedSGPA / 10) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-green-600 mt-2">Out of 10.0</p>
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
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {semesterData[semesterData.length - 1].gpa}
            </div>
            <div className="text-sm text-gray-600">Latest GPA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {((semesterData[semesterData.length - 1].gpa - semesterData[0].gpa) / semesterData[0].gpa * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Improvement</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {totalCredits}
            </div>
            <div className="text-sm text-gray-600">Total Credits</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {semesterData.length}
            </div>
            <div className="text-sm text-gray-600">Semesters</div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
        <p className="text-sm text-indigo-700 text-center">
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
