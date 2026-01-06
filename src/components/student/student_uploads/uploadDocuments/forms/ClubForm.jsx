import FloatingInput from "../shared/FloatingInput";
import DragDropUpload from "../shared/DragDropUpload";

const ClubForm = ({ formData, handleChange, handleFileSelect, imagePreview, handleRemoveImage, errors }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Club Name"
          name="clubName"
          value={formData.clubName}
          onChange={handleChange}
          placeholder="e.g., Coding Club"
          required
          error={errors.clubName}
        />
        <FloatingInput
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Member, President"
          required
          error={errors.title}
        />
        <FloatingInput
          label="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          placeholder="e.g., Member"
        />
        <FloatingInput
          label="Joined On"
          type="date"
          name="joinedOn"
          value={formData.joinedOn}
          onChange={handleChange}
          className="date-input"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-4">
          Upload Image *
        </label>
        <DragDropUpload
          onFileSelect={handleFileSelect}
          preview={imagePreview}
          onRemove={handleRemoveImage}
          error={errors.image}
          fileName={formData.image?.name}
        />
      </div>
    </div>
  );
};

export default ClubForm;

