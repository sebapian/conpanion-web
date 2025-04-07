'use client'
import { Database } from '@/lib/supabase/types.generated'
import { formatDistanceToNow, format } from 'date-fns'
import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { X, Pencil, Check, Send, Plus, Calendar } from 'lucide-react'
import StatusPill from './StatusPill'
import PriorityPill from './PriorityPill'
import { useState, useRef, useEffect, ChangeEvent } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useTaskMetadata } from '../../protected/tasks/hooks'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'

type Status = Database['public']['Tables']['statuses']['Row']
type Priority = Database['public']['Tables']['priorities']['Row']
type Label = Database['public']['Tables']['labels']['Row']

interface AddTaskDrawerProps {
  isOpen: boolean
  onClose: () => void
  allStatuses: Status[]
  allPriorities: Priority[]
  refreshTasks: () => void
}

export function AddTaskDrawer({ 
  isOpen, 
  onClose, 
  allStatuses,
  allPriorities,
  refreshTasks
}: AddTaskDrawerProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [statusId, setStatusId] = useState<number | null>(
    allStatuses.find(s => s.is_default)?.id || allStatuses[0]?.id || null
  );
  const [priorityId, setPriorityId] = useState<number | null>(
    allPriorities.find(p => p.is_default)?.id || allPriorities[0]?.id || null
  );
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Label creation popup state
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [showLabelPopup, setShowLabelPopup] = useState(false);
  const [labelName, setLabelName] = useState('');
  const [labelColor, setLabelColor] = useState('#3B82F6'); // Default blue color
  const [savingLabel, setSavingLabel] = useState(false);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [availableLabels, setAvailableLabels] = useState<Label[]>([]);
  
  // Get all labels for selection
  useEffect(() => {
    if (isOpen) {
      fetchLabels();
    }
  }, [isOpen]);
  
  const fetchLabels = async () => {
    try {
      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('labels')
        .select('*')
        .order('name');
        
      if (error) {
        console.error('Error fetching labels:', error);
      } else {
        setAvailableLabels(data || []);
      }
    } catch (err) {
      console.error('Exception fetching labels:', err);
    }
  };

  // Custom metadata state
  const [customMetadata, setCustomMetadata] = useState<Array<{title: string, value: string}>>([]);
  const [showAddMetadataForm, setShowAddMetadataForm] = useState(false);
  const [newMetadataTitle, setNewMetadataTitle] = useState('');
  const [newMetadataValue, setNewMetadataValue] = useState('');
  
  // Estimate hours fields
  const [estimatedHours, setEstimatedHours] = useState<string>('');
  const [manpower, setManpower] = useState<string>('');

  const handleCreateTask = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseClient();
      
      // 1. Create the task
      const now = new Date().toISOString();
      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          status_id: statusId,
          priority_id: priorityId,
          due_date: dueDate ? dueDate.toISOString() : null,
          created_at: now,
          updated_at: now,
          created_by: user?.id
        })
        .select('id')
        .single();
      
      if (taskError) {
        console.error('Error creating task:', taskError);
        setError('Failed to create task');
        setSaving(false);
        return;
      }
      
      const taskId = taskData.id;
      
      // 2. Add labels if any are selected
      if (selectedLabels.length > 0) {
        const labelLinks = selectedLabels.map(label => ({
          task_id: taskId,
          label_id: label.id
        }));
        
        const { error: labelError } = await supabase
          .from('task_labels')
          .insert(labelLinks);
          
        if (labelError) {
          console.error('Error adding labels:', labelError);
        }
      }
      
      // 3. Add metadata including estimated_hours and actual_hours
      const metadata = [...customMetadata];
      
      if (estimatedHours.trim()) {
        metadata.push({
          title: 'estimated_hours',
          value: estimatedHours.trim()
        });
      }
      
      if (manpower.trim()) {
        metadata.push({
          title: 'manpower',
          value: manpower.trim()
        });
      }
      
      if (metadata.length > 0) {
        const metadataRecords = metadata.map(item => ({
          task_id: taskId,
          title: item.title,
          value: item.value,
          created_at: now,
          updated_at: now,
          created_by: user?.id
        }));
        
        const { error: metadataError } = await supabase
          .from('task_metadata')
          .insert(metadataRecords);
          
        if (metadataError) {
          console.error('Error adding metadata:', metadataError);
        }
      }
      
      // Refresh tasks and close the drawer
      refreshTasks();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Exception creating task:', err);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatusId(allStatuses.find(s => s.is_default)?.id || allStatuses[0]?.id || null);
    setPriorityId(allPriorities.find(p => p.is_default)?.id || allPriorities[0]?.id || null);
    setDueDate(undefined);
    setSelectedLabels([]);
    setCustomMetadata([]);
    setEstimatedHours('');
    setManpower('');
    setError(null);
  };
  
  const handleCreateLabel = async () => {
    if (!labelName.trim()) {
      setLabelError('Label name is required');
      return;
    }

    setSavingLabel(true);
    setLabelError(null);

    try {
      const supabase = getSupabaseClient();
      
      // First check if the label already exists
      const { data: existingLabels, error: searchError } = await supabase
        .from('labels')
        .select('*')
        .ilike('name', labelName.trim())
        .limit(1);
      
      if (searchError) {
        console.error('Error searching for existing label:', searchError);
        setLabelError('Failed to check for existing labels');
        setSavingLabel(false);
        return;
      }
      
      // If label exists, use it
      if (existingLabels && existingLabels.length > 0) {
        const existingLabel = existingLabels[0];
        
        // Check if it's already selected
        if (!selectedLabels.some(l => l.id === existingLabel.id)) {
          setSelectedLabels([...selectedLabels, existingLabel]);
        }
        
        // Reset form and close popup
        setLabelName('');
        setLabelColor('#3B82F6');
        setShowLabelPopup(false);
        setSavingLabel(false);
        return;
      }
      
      // If label doesn't exist, create it
      const { data: newLabel, error: labelError } = await supabase
        .from('labels')
        .insert({ 
          name: labelName.trim(), 
          color: labelColor 
        })
        .select('*')
        .single();
      
      if (labelError) {
        // Check if this is an RLS policy violation
        if (labelError.code === '42501') {
          setLabelError('You don\'t have permission to create new labels. Please contact an administrator.');
        } else {
          console.error('Error creating label:', labelError);
          setLabelError('Failed to create label');
        }
        setSavingLabel(false);
        return;
      }
      
      // Add the new label to selected labels
      setSelectedLabels([...selectedLabels, newLabel]);
      
      // Also add to available labels for future selection
      setAvailableLabels([...availableLabels, newLabel]);
      
      // Reset form and close popup
      setLabelName('');
      setLabelColor('#3B82F6');
      setShowLabelPopup(false);
    } catch (err) {
      console.error('Exception in label handling:', err);
      setLabelError('An unexpected error occurred');
    } finally {
      setSavingLabel(false);
    }
  };

  const handleAddMetadata = () => {
    if (!newMetadataTitle.trim() || !newMetadataValue.trim()) return;
    
    setCustomMetadata([...customMetadata, {
      title: newMetadataTitle.trim(),
      value: newMetadataValue.trim()
    }]);
    
    setNewMetadataTitle('');
    setNewMetadataValue('');
    setShowAddMetadataForm(false);
  };
  
  const handleRemoveMetadata = (index: number) => {
    const newMetadata = [...customMetadata];
    newMetadata.splice(index, 1);
    setCustomMetadata(newMetadata);
  };
  
  const handleSelectLabel = (label: Label) => {
    if (selectedLabels.some(l => l.id === label.id)) {
      setSelectedLabels(selectedLabels.filter(l => l.id !== label.id));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };
  
  const handleRemoveLabel = (labelId: number) => {
    setSelectedLabels(selectedLabels.filter(l => l.id !== labelId));
  };

  // Handle numeric input for hours
  const handleHoursChange = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with "inert" attribute to block all interactions */}
      <div 
        className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        style={{ touchAction: 'none' }}
        // This will disable all interactions with elements behind the modal
        aria-hidden={isOpen ? "true" : "false"}
        tabIndex={-1}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl bg-gray-800 border-l border-gray-700 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        onClick={e => e.stopPropagation()}
        aria-modal="true"
        role="dialog"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex justify-between items-start sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-semibold text-white">Create New Task</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-400 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
              disabled={saving}
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-400 mb-2">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-md w-full min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task description"
              disabled={saving}
            />
          </div>
          
          {/* Status and Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Status
              </label>
              <div className="bg-gray-700 rounded-md p-3">
                {statusId ? (
                  <div className="flex flex-wrap gap-2">
                    {allStatuses.map(status => (
                      <div
                        key={status.id}
                        onClick={() => setStatusId(status.id)}
                        className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 transition-colors ${
                          statusId === status.id 
                            ? 'ring-2 ring-offset-1 ring-offset-gray-800' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: status.color || '#E2E8F0',
                          color: 'black'
                        }}
                      >
                        {status.name}
                        {status.is_default && (
                          <span className="text-xs ml-1">(Default)</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No statuses available</div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Priority
              </label>
              <div className="bg-gray-700 rounded-md p-3">
                {priorityId ? (
                  <div className="flex flex-wrap gap-2">
                    {allPriorities.map(priority => (
                      <div
                        key={priority.id}
                        onClick={() => setPriorityId(priority.id)}
                        className={`px-3 py-1 rounded-full cursor-pointer flex items-center gap-1 transition-colors ${
                          priorityId === priority.id 
                            ? 'ring-2 ring-offset-1 ring-offset-gray-800' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: priority.color || '#E2E8F0',
                          color: 'black'
                        }}
                      >
                        {priority.name}
                        {priority.is_default && (
                          <span className="text-xs ml-1">(Default)</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No priorities available</div>
                )}
              </div>
            </div>
          </div>
          
          {/* Due Date */}
          <div>
            <label htmlFor="due-date" className="block text-sm font-medium text-gray-400 mb-2">
              Due Date
            </label>
            <DatePicker
              date={dueDate}
              setDate={setDueDate}
              disabled={saving}
              placeholder="Select due date"
            />
          </div>
          
          {/* Labels */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-400">
                Labels
              </label>
              <button 
                onClick={() => setShowLabelPopup(true)}
                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                disabled={saving}
              >
                <Plus size={14} className="mr-1" />
                <span>Add Label</span>
              </button>
            </div>
            
            {selectedLabels.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedLabels.map(label => {
                  const labelColor = label.color || '#E2E8F0';
                  return (
                    <Badge
                      key={label.id}
                      variant="outline"
                      style={{ 
                        backgroundColor: `${labelColor}20`,
                        borderColor: labelColor,
                        color: labelColor
                      }}
                      className="text-xs px-2 py-1 flex items-center gap-1"
                    >
                      {label.name}
                      <button
                        onClick={() => handleRemoveLabel(label.id)}
                        className="text-gray-400 hover:text-white ml-1"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            ) : (
              <div className="text-gray-400 mb-3">No labels selected</div>
            )}
            
            {/* Available labels for quick selection */}
            {availableLabels.length > 0 && (
              <div className="bg-gray-750 rounded-md p-3">
                <div className="text-xs text-gray-400 mb-2">Available Labels</div>
                <div className="flex flex-wrap gap-2">
                  {availableLabels
                    .filter(label => !selectedLabels.some(l => l.id === label.id))
                    .map(label => {
                      const labelColor = label.color || '#E2E8F0';
                      return (
                        <Badge
                          key={label.id}
                          variant="outline"
                          style={{ 
                            backgroundColor: `${labelColor}20`,
                            borderColor: labelColor,
                            color: labelColor
                          }}
                          className="text-xs px-2 py-1 cursor-pointer hover:ring-1 hover:ring-gray-400"
                          onClick={() => handleSelectLabel(label)}
                        >
                          {label.name}
                        </Badge>
                      );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Fields */}
          <div className="border-t border-gray-700 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-400">Additional Fields</h3>
              {!showAddMetadataForm && (
                <button 
                  onClick={() => setShowAddMetadataForm(true)}
                  className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                  disabled={saving}
                >
                  <Plus size={14} className="mr-1" />
                  <span>Add Field</span>
                </button>
              )}
            </div>
            
            {/* Time Tracking Fields */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-gray-750 rounded-md p-3">
                <div className="text-gray-400 text-xs mb-1">Estimated Hours</div>
                <input
                  type="text"
                  value={estimatedHours}
                  onChange={(e) => handleHoursChange(e.target.value, setEstimatedHours)}
                  className="bg-gray-700 text-white px-3 py-1 rounded w-full text-sm"
                  placeholder="e.g., 4.5"
                  disabled={saving}
                />
              </div>
              
              <div className="bg-gray-750 rounded-md p-3">
                <div className="text-gray-400 text-xs mb-1">Manpower</div>
                <input
                  type="text"
                  value={manpower}
                  onChange={(e) => handleHoursChange(e.target.value, setManpower)}
                  className="bg-gray-700 text-white px-3 py-1 rounded w-full text-sm"
                  placeholder="e.g., 3.25"
                  disabled={saving}
                />
              </div>
            </div>
            
            {/* Add Metadata Form */}
            {showAddMetadataForm && (
              <div className="bg-gray-750 rounded-md p-3 mb-3">
                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="metadata-title" className="block text-xs text-gray-400 mb-1">
                        Field Name
                      </label>
                      <input
                        id="metadata-title"
                        type="text"
                        value={newMetadataTitle}
                        onChange={(e) => setNewMetadataTitle(e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-sm"
                        placeholder="e.g., priority_score"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label htmlFor="metadata-value" className="block text-xs text-gray-400 mb-1">
                        Value
                      </label>
                      <input
                        id="metadata-value"
                        type="text"
                        value={newMetadataValue}
                        onChange={(e) => setNewMetadataValue(e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded w-full text-sm"
                        placeholder="e.g., 8.5"
                        disabled={saving}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button
                      onClick={() => setShowAddMetadataForm(false)}
                      className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors text-xs"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddMetadata}
                      disabled={!newMetadataTitle.trim() || !newMetadataValue.trim() || saving}
                      className={`px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-xs ${
                        !newMetadataTitle.trim() || !newMetadataValue.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Custom Metadata List */}
            {customMetadata.length > 0 && (
              <div className="space-y-2 mb-3">
                {customMetadata.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-750 rounded-md p-2 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="text-gray-400 text-xs">{item.title}</div>
                      <div className="text-white text-sm font-medium truncate">
                        {item.value}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMetadata(index)}
                      className="text-gray-400 hover:text-red-400 p-1"
                      disabled={saving}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* No fields message */}
            {customMetadata.length === 0 && !estimatedHours && !manpower && !showAddMetadataForm && (
              <div className="text-gray-400 text-center py-2 text-sm">
                Add fields to store custom information about this task.
              </div>
            )}
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded-md border border-red-500/20">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50 mt-auto">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-blue-500 hover:bg-blue-600"
              onClick={handleCreateTask}
              disabled={saving || !title.trim()}
            >
              {saving ? 'Creating...' : 'Create Task'}
            </Button>
          </div>
        </div>

        {/* Label Creation Popup */}
        {showLabelPopup && (
          <div 
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={(e) => {
              e.stopPropagation();
              setShowLabelPopup(false);
            }}
          >
            <div 
              className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl w-full max-w-md p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Create New Label</h3>
                <button 
                  onClick={() => setShowLabelPopup(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Label Name Input */}
                <div>
                  <label htmlFor="label-name" className="block text-sm font-medium text-gray-400 mb-1">
                    Label Name
                  </label>
                  <input
                    id="label-name"
                    type="text"
                    value={labelName}
                    onChange={(e) => setLabelName(e.target.value)}
                    className="text-white bg-gray-700 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter label name"
                    disabled={savingLabel}
                  />
                </div>
                
                {/* Color Picker */}
                <div>
                  <label htmlFor="label-color" className="block text-sm font-medium text-gray-400 mb-1">
                    Label Color
                  </label>
                  <div className="flex items-center">
                    <input
                      id="label-color"
                      type="color"
                      value={labelColor}
                      onChange={(e) => setLabelColor(e.target.value)}
                      className="bg-gray-700 rounded-md p-1 w-12 h-10 cursor-pointer"
                      disabled={savingLabel}
                    />
                    <span className="ml-3 text-white">
                      {labelColor}
                    </span>
                  </div>
                </div>
                
                {/* Label Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Preview
                  </label>
                  <div className="flex items-center">
                    <Badge
                      variant="outline"
                      style={{ 
                        backgroundColor: `${labelColor}20`,
                        borderColor: labelColor,
                        color: labelColor
                      }}
                      className="text-xs px-2 py-1"
                    >
                      {labelName || 'Label Preview'}
                    </Badge>
                  </div>
                </div>
                
                {labelError && (
                  <p className="text-red-500 text-xs">{labelError}</p>
                )}
                
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowLabelPopup(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                    disabled={savingLabel}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateLabel}
                    disabled={savingLabel || !labelName.trim()}
                    className={`px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors ${
                      !labelName.trim() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {savingLabel ? 'Creating...' : 'Create Label'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 