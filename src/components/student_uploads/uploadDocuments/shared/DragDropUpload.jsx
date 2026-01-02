import { useState, useRef } from "react";
import { Upload, X, AlertCircle } from "lucide-react";

const DragDropUpload = ({ onFileSelect, preview, onRemove, error, fileName }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 cursor-pointer group ${
          dragOver 
            ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
            : error 
            ? 'border-red-300 hover:border-red-400' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className={`transition-all duration-300 ${dragOver ? 'scale-110' : 'group-hover:scale-105'}`}>
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {dragOver ? 'Drop your image here' : 'Upload Image'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Drag and drop or click to browse
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            Choose File
          </div>
        </div>
        
        {fileName && !preview && (
          <div className="mt-4 text-sm text-gray-600">
            Selected: {fileName}
          </div>
        )}
      </div>

      {preview && (
        <div className="relative group">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 border-2 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Preview</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 hover:bg-red-100 rounded-full transition-colors group"
              >
                <X className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-h-48 rounded-2xl shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
};

export default DragDropUpload;

