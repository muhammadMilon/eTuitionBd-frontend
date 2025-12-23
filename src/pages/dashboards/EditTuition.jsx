import { BookOpen, Save, ArrowLeft, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import toast from 'react-hot-toast';

const EditTuition = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    location: '',
    budget: '',
    schedule: '',
    description: '',
    requirements: [],
  });
  const [requirementInput, setRequirementInput] = useState('');

  useEffect(() => {
    fetchTuition();
  }, [id]);

  const fetchTuition = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/tuitions/${id}`);
      const tuition = data.tuition;
      
      setFormData({
        title: tuition.title || '',
        subject: tuition.subject || '',
        class: tuition.class || '',
        location: tuition.location || '',
        budget: tuition.budget || '',
        schedule: tuition.schedule || '',
        description: tuition.description || '',
        requirements: tuition.requirements || [],
      });
    } catch (error) {
      console.error('Error fetching tuition:', error);
      toast.error('Failed to load tuition');
      navigate('/dashboard/tuitions');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput('');
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subject || !formData.class || !formData.location || !formData.budget || !formData.schedule || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);
      await api.put(`/api/tuitions/${id}`, formData);
      toast.success('Tuition updated successfully!');
      navigate('/dashboard/tuitions');
    } catch (error) {
      console.error('Error updating tuition:', error);
      toast.error(error.response?.data?.message || 'Failed to update tuition');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <BookOpen className="text-primary" size={40} />
            Edit Tuition
          </h1>
          <p className="text-base-content/70">Update your tuition post information</p>
        </div>
        <Link to="/dashboard/tuitions" className="btn btn-ghost">
          <ArrowLeft size={20} />
          Back to Tuitions
        </Link>
      </div>

      {/* Form */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Title <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Class 9-10 Mathematics Tuition"
                className="input input-bordered w-full bg-base-100"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Subject and Class */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Subject <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g., Mathematics, Physics, English"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Class <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="class"
                  placeholder="e.g., 9-10, 11-12, 6-8"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.class}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Location and Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Location <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g., Dhanmondi, Dhaka"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Budget (per month) <span className="text-error">*</span></span>
                </label>
                <input
                  type="text"
                  name="budget"
                  placeholder="e.g., 5000-7000 or 6000"
                  className="input input-bordered w-full bg-base-100"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
                <label className="label">
                  <span className="label-text-alt">Enter range (e.g., 5000-7000) or single amount</span>
                </label>
              </div>
            </div>

            {/* Schedule */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Schedule <span className="text-error">*</span></span>
              </label>
              <input
                type="text"
                name="schedule"
                placeholder="e.g., Saturday & Sunday, 4 PM - 6 PM"
                className="input input-bordered w-full bg-base-100"
                value={formData.schedule}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Description <span className="text-error">*</span></span>
              </label>
              <textarea
                name="description"
                className="textarea textarea-bordered w-full h-32 bg-base-100"
                placeholder="Describe the tuition requirements, student's needs, teaching style preferences, etc."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            {/* Requirements */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Requirements (Optional)</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input input-bordered flex-1 bg-base-100"
                  placeholder="Add a requirement (e.g., Minimum 3 years experience)"
                  value={requirementInput}
                  onChange={(e) => setRequirementInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRequirement();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddRequirement}
                  className="btn btn-primary"
                >
                  <Plus size={20} />
                  Add
                </button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-base-300 rounded-lg">
                      <span className="flex-1">{req}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="btn btn-ghost btn-xs"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="card-actions justify-end">
              <Link to="/dashboard/tuitions" className="btn btn-ghost">
                Cancel
              </Link>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <Save size={20} />
                    Update Tuition
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTuition;

