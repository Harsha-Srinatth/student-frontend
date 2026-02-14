import React, { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import CreateClubModal from '@/components/HOD/CreateNewClubs/CreateClubModel';
import AssignModal from '@/components/HOD/CreateNewClubs/AssignModel';
import ClubCard from '@/components/HOD/CreateNewClubs/ClubCard';
import Header from '@/components/HOD/CreateNewClubs/Header';
import api from '@/services/api';

const CreateNewClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);

  // Fetch clubs on component mount
  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/hod/clubs');
      if (res.data?.ok) {
        setClubs(res.data.clubs || []);
      }
    } catch (error) {
      console.error('Error fetching clubs:', error);
      alert('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClub = async (newClub) => {
    // Refresh clubs list
    await fetchClubs();
  };

  const handleAssign = (club) => {
    setSelectedClub(club);
    setIsAssignModalOpen(true);
  };

  const handleAssignUpdate = async (clubId, updatedClub) => {
    // Update the club in the list
    setClubs(clubs.map(club => 
      club.clubId === clubId ? { ...club, ...updatedClub } : club
    ));
    // Refresh to get updated details
    await fetchClubs();
  };

  const handleDelete = async (clubId) => {
    if (!window.confirm('Are you sure you want to delete this club? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/hod/clubs/${clubId}`);
      if (res.data?.ok) {
        setClubs(clubs.filter(club => club.clubId !== clubId));
        alert('Club deleted successfully');
      } else {
        alert(res.data?.message || 'Failed to delete club');
      }
    } catch (error) {
      console.error('Error deleting club:', error);
      alert(error.response?.data?.message || 'Failed to delete club');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <Header />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clubs Management</h1>
            <p className="text-gray-600 mt-1">Create and manage clubs for your department</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create New Club
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading clubs...</span>
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">No clubs yet</h3>
              <p className="text-gray-600 mb-6">
                Get started by creating your first club for the department
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Your First Club
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard
                key={club.clubId}
                club={club}
                onAssign={handleAssign}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <CreateClubModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateClub={handleCreateClub}
      />

      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedClub(null);
        }}
        club={selectedClub}
        onAssign={handleAssignUpdate}
      />
    </div>
  );
};

export default CreateNewClubs;

