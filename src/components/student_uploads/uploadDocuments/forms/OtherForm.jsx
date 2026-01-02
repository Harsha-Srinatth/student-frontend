import FloatingInput from "../shared/FloatingInput";

const OtherForm = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <FloatingInput
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Describe your achievement or activity..."
        textarea
        rows={4}
        required
        error={errors.description}
      />
    </div>
  );
};

export default OtherForm;

