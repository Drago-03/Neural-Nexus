"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, Clock, Home, Search, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ApplicationModal from './ApplicationModal';

interface Position {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  remote: boolean;
}

interface JobListingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: Position[];
}

export default function JobListingsModal({
  isOpen,
  onClose,
  positions
}: JobListingsModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  // Filter positions based on search query and filters
  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filterLocation || 
      (filterLocation === 'remote' ? position.remote : position.location.includes(filterLocation));
    const matchesDepartment = !filterDepartment || position.department === filterDepartment;
    
    return matchesSearch && matchesLocation && matchesDepartment;
  });
  
  // Extract unique departments for filter
  const departments = Array.from(new Set(positions.map(position => position.department)));

  // Extract unique locations for filter (excluding "Remote" which we handle specially)
  const locations = Array.from(
    new Set(
      positions
        .map(position => position.location.split(',')[0].trim())
        .filter(location => location !== 'Remote')
    )
  );

  const handleApplyClick = (position: Position) => {
    setSelectedPosition(position);
    setApplicationModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            
            {/* Modal */}
            <motion.div
              className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-4xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Open Positions</h2>
                  <button
                    className="p-1 rounded-full hover:bg-gray-800 transition-colors"
                    onClick={onClose}
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Search & Filters */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search positions..."
                        className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <select
                      className="bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      value={filterLocation || ''}
                      onChange={(e) => setFilterLocation(e.target.value || null)}
                      aria-label="Filter by location"
                    >
                      <option value="">All Locations</option>
                      {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                      <option value="remote">Remote</option>
                    </select>
                    
                    <select
                      className="bg-gray-700/50 border border-gray-600 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      value={filterDepartment || ''}
                      onChange={(e) => setFilterDepartment(e.target.value || null)}
                      aria-label="Filter by department"
                    >
                      <option value="">All Departments</option>
                      {departments.map(department => (
                        <option key={department} value={department}>{department}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {filteredPositions.length > 0 ? (
                  <div className="space-y-6">
                    {filteredPositions.map((position) => (
                      <div
                        key={position.id}
                        className="bg-gray-800/30 border border-gray-700/50 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all hover:shadow-md hover:shadow-purple-500/10"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{position.title}</h3>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <div className="flex items-center text-gray-400">
                                  <Briefcase className="h-4 w-4 mr-1" />
                                  <span>{position.department}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{position.location}</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>{position.type}</span>
                                </div>
                                {position.remote && (
                                  <div className="flex items-center text-green-400">
                                    <Home className="h-4 w-4 mr-1" />
                                    <span>Remote</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 md:mt-0">
                              <button 
                                onClick={() => handleApplyClick(position)}
                                className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
                              >
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <h3 className="text-xl font-bold mb-2">No positions found</h3>
                    <p className="text-gray-300 mb-4">
                      Try changing your search or filter settings.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterLocation(null);
                        setFilterDepartment(null);
                      }}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-6 border-t border-gray-800 text-center">
                <p className="text-gray-400 text-sm">
                  Don't see a position that fits your skills? 
                  <button 
                    onClick={() => {
                      setSelectedPosition(null);
                      setApplicationModalOpen(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 ml-1"
                  >
                    Apply for general consideration
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        selectedPosition={selectedPosition}
        positions={positions}
      />
    </>
  );
} 