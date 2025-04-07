'use client'

import { TaskCard } from '@/app/components/tasks/TaskCard'
import { TaskColumnSkeleton } from '@/app/components/tasks/TaskColumnSkeleton'
import { TaskCardSkeleton } from '@/app/components/tasks/TaskCardSkeleton'
import { DragPlaceholder } from '@/app/components/tasks/DragPlaceholder'
import { useTaskStatuses, useTaskPriorities } from './hooks'
import { useTasks } from './hooks'
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from 'react'
import { AddTaskDrawer } from '@/app/components/tasks/AddTaskDrawer'
import { 
  DndContext, 
  DragOverlay, 
  useSensors, 
  useSensor, 
  PointerSensor,
  closestCorners,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
} from '@dnd-kit/core'
import { 
  SortableContext, 
  rectSortingStrategy,
  useSortable,
  arrayMove 
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TaskWithRelations } from './models'
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/client"
import { Database } from '@/lib/supabase/types.generated'

export default function TasksPage() {
  const { statuses, loading: loadingStatuses } = useTaskStatuses();
  const { priorities, loading: loadingPriorities } = useTaskPriorities();
  const { tasks, loading: loadingTasks, refresh: refreshTasks } = useTasks();
  const [isAddTaskDrawerOpen, setIsAddTaskDrawerOpen] = useState(false);
  
  // Drag and drop state
  const [activeTask, setActiveTask] = useState<TaskWithRelations | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCardHeight, setDragCardHeight] = useState<number>(0);
  
  // Configure sensors for drag and drop with disabled state
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum drag distance before activation
      },
      // Add event handlers to prevent activation when drawer is open
      eventListeners: {
        // Cancel pointer down event if drawer is open
        onPointerDown: ({ nativeEvent }: { nativeEvent: PointerEvent }) => {
          if (isAddTaskDrawerOpen) {
            nativeEvent.stopPropagation();
            nativeEvent.preventDefault();
            return false;
          }
        }
      }
    })
  );
  
  // Prevent drag start when drawer is open
  const handleDragStart = (event: DragStartEvent) => {
    // Block drag completely if a drawer is open
    if (isAddTaskDrawerOpen) {
      // Just return without setting active task
      return;
    }
    
    const { active } = event;
    const taskId = parseInt(active.id.toString());
    const draggedTask = tasks.find(task => task.id === taskId);
    
    if (draggedTask) {
      setActiveTask(draggedTask);
      setIsDragging(true);
      
      // Get the dimensions of the card being dragged
      const nodeElement = document.getElementById(`task-card-${taskId}`);
      if (nodeElement) {
        const { height } = nodeElement.getBoundingClientRect();
        setDragCardHeight(height + 16); // Add space for margin
      } else {
        setDragCardHeight(140); // Fallback height including margin
      }
    }
  };
  
  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setActiveTask(null);
      setIsDragging(false);
      return;
    }
    
    const taskId = parseInt(active.id.toString());
    
    // Extract the status ID from the container ID
    // The ID format is either 'status-{statusId}' or just '{statusId}'
    let statusId: number;
    const overId = over.id.toString();
    
    if (overId.includes('status-')) {
      statusId = parseInt(overId.split('-')[1]);
    } else {
      statusId = parseInt(overId);
    }
    
    // Only update if the status has changed
    const draggedTask = tasks.find(task => task.id === taskId);
    if (draggedTask && draggedTask.status_id !== statusId) {
      try {
        const supabase = getSupabaseClient();
        await supabase
          .from('tasks')
          .update({ 
            status_id: statusId,
            updated_at: new Date().toISOString()
          })
          .eq('id', taskId);
          
        // Refresh tasks after successful update
        refreshTasks();
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
    
    setActiveTask(null);
    setIsDragging(false);
  };
  
  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!active || !over) return;
    
    // We're just interested in the droppable status column containers
    const isOverStatusContainer = over.id.toString().includes('status-');
    
    if (isOverStatusContainer) {
      // The ID format is 'status-{statusId}'
      const statusId = parseInt(over.id.toString().split('-')[1]);
      const taskId = parseInt(active.id.toString());
      
      // Get the task that's being dragged
      const draggedTask = tasks.find(task => task.id === taskId);
      
      // If we're dragging over the same status column that the task is already in,
      // we don't need to update anything
      if (draggedTask && draggedTask.status_id === statusId) {
        return;
      }
      
      // Otherwise, we're dragging over a different status column,
      // so we'll show a placeholder for where the task will be dropped
    }
  };

  const loading = loadingStatuses || loadingPriorities || loadingTasks;

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <Button 
            variant="default" 
            className="flex items-center gap-1"
            disabled
          >
            <Plus size={16} />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <TaskColumnSkeleton />
          <TaskColumnSkeleton />
          <TaskColumnSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button 
          variant="default" 
          className="flex items-center gap-1"
          onClick={() => setIsAddTaskDrawerOpen(true)}
        >
          <Plus size={16} />
          Add Task
        </Button>
      </div>
      
      {isAddTaskDrawerOpen ? (
        // When drawer is open, render tasks without DndContext
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {statuses.map((status) => (
            <div 
              key={status.id}
              className="bg-white dark:bg-gray-900 border border-gray-800 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{status.name}</h3>
                <div 
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: status.color || '#E2E8F0' }}
                />
              </div>
              
              <div className="space-y-4">
                {tasks
                  .filter((task) => task.status_id === status.id)
                  .map((task) => {
                    // Filter out null labels and provide fallback for priority
                    const taskPriority = task.priorities || {
                      id: 0,
                      name: 'No Priority',
                      color: '#E2E8F0',
                      position: 0,
                      is_default: false,
                      project_id: 0,
                      created_at: '',
                      created_by: ''
                    };
                    
                    const taskLabels = task.entity_labels
                      ?.map((el) => el.labels)
                      .filter((label): label is NonNullable<typeof label> => label !== null) || [];
                      
                    return (
                      <TaskCard
                        key={task.id}
                        task={task}
                        status={status}
                        priority={taskPriority}
                        labels={taskLabels}
                        assignees={task.entity_assignees?.map((ea) => ({
                          id: ea.user_id,
                          name: ea.users.raw_user_meta_data.name,
                          avatar_url: ea.users.raw_user_meta_data.avatar_url,
                        })) ?? []}
                        allStatuses={statuses}
                        allPriorities={priorities}
                        refreshTasks={refreshTasks}
                      />
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Normal drag-and-drop enabled view
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <StatusColumn 
                key={status.id} 
                status={status}
                tasks={tasks.filter((task) => task.status_id === status.id)}
                allStatuses={statuses}
                allPriorities={priorities}
                refreshTasks={refreshTasks}
                isDragging={isDragging}
                activeTaskId={activeTask?.id}
                dragCardHeight={dragCardHeight}
                isAddTaskDrawerOpen={isAddTaskDrawerOpen}
              />
            ))}
          </div>
          
          {/* Drag overlay to show what's being dragged */}
          <DragOverlay adjustScale zIndex={100}>
            {activeTask && (
              <TaskCard
                task={activeTask}
                status={statuses.find(s => s.id === activeTask.status_id) || statuses[0]}
                priority={activeTask.priorities || {
                  id: 0,
                  name: 'No Priority',
                  color: '#E2E8F0',
                  position: 0,
                  is_default: false,
                  project_id: 0,
                  created_at: '',
                  created_by: ''
                }}
                labels={activeTask.entity_labels
                  ?.map((el) => el.labels)
                  .filter((label): label is NonNullable<typeof label> => label !== null) || []}
                assignees={activeTask.entity_assignees?.map((ea) => ({
                  id: ea.user_id,
                  name: ea.users.raw_user_meta_data.name,
                  avatar_url: ea.users.raw_user_meta_data.avatar_url,
                })) ?? []}
                allStatuses={statuses}
                allPriorities={priorities}
                refreshTasks={refreshTasks}
                className="opacity-80 shadow-xl cursor-grabbing transform scale-105"
              />
            )}
          </DragOverlay>
        </DndContext>
      )}
      
      {/* Add Task Drawer */}
      <AddTaskDrawer
        isOpen={isAddTaskDrawerOpen}
        onClose={() => setIsAddTaskDrawerOpen(false)}
        allStatuses={statuses}
        allPriorities={priorities}
        refreshTasks={refreshTasks}
      />
      
      {/* Full-screen overlay when drawer is open to block all background interactions */}
      {isAddTaskDrawerOpen && (
        <div 
          className="fixed inset-0 bg-transparent" 
          style={{ 
            pointerEvents: 'auto',
            cursor: 'default',
            touchAction: 'none',
            zIndex: 45 // High enough to be above tasks but below drawer (z-50)
          }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

// Wrapper component to make TaskCard draggable
interface DraggableTaskCardProps extends React.ComponentProps<typeof TaskCard> {
  isDragging?: boolean;
  isAddTaskDrawerOpen?: boolean;
}

function DraggableTaskCard({ task, isDragging, isAddTaskDrawerOpen, ...props }: DraggableTaskCardProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task.id,
    data: task,
    disabled: isAddTaskDrawerOpen // Disable sortable when drawer is open
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.3 : 1,
    cursor: isSortableDragging ? 'grabbing' : 'grab',
    zIndex: isSortableDragging ? 10 : 'auto',
  };
  
  return (
    <div
      ref={setNodeRef}
      id={`task-card-${task.id}`}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none transition-all duration-200",
        isDragging && "z-10",
        isAddTaskDrawerOpen && "pointer-events-none"
      )}
    >
      <TaskCard 
        task={task}
        {...props}
      />
    </div>
  );
}

interface StatusColumnProps {
  status: Database['public']['Tables']['statuses']['Row'];
  tasks: TaskWithRelations[];
  allStatuses: Database['public']['Tables']['statuses']['Row'][];
  allPriorities: Database['public']['Tables']['priorities']['Row'][];
  refreshTasks: () => void;
  isDragging: boolean;
  activeTaskId?: number;
  dragCardHeight: number;
  isAddTaskDrawerOpen: boolean;
}

function StatusColumn({ 
  status, 
  tasks, 
  allStatuses,
  allPriorities, 
  refreshTasks,
  isDragging,
  activeTaskId,
  dragCardHeight,
  isAddTaskDrawerOpen
}: StatusColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `status-${status.id}`,
    data: { statusId: status.id }
  });
  
  // Calculate a minimum height based on tasks length
  const tasksHeight = tasks.length * 130; // Approximate height of a task card plus margin
  const minColumnHeight = tasksHeight > 0 ? tasksHeight : 200; // Minimum height to prevent flickering

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative bg-white dark:bg-gray-900 border border-gray-800 rounded-lg p-4 transition-all duration-200",
        isOver && isDragging && "ring-1 ring-blue-500 ring-inset"
      )}
      style={isDragging ? { 
        // Apply a stable minimum height during any drag operation
        minHeight: `${minColumnHeight}px`,
        // Only add extra space when hovering
        ...(isOver ? { paddingBottom: `${dragCardHeight}px` } : {})
      } : {}}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">{status.name}</h3>
        <div 
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: status.color || '#E2E8F0' }}
        />
      </div>
      
      <SortableContext
        items={tasks.map(task => task.id)}
        strategy={rectSortingStrategy}
      >
        <div 
          className="space-y-4" 
          id={status.id.toString()} 
          data-status-id={status.id}
        >
          {/* Only render tasks that aren't being dragged */}
          {tasks.map((task) => {
            // Skip rendering the currently dragged task in its original position
            if (task.id === activeTaskId) return null;
            
            // Filter out null labels and provide fallback for priority
            const taskPriority = task.priorities || {
              id: 0,
              name: 'No Priority',
              color: '#E2E8F0',
              position: 0,
              is_default: false,
              project_id: 0,
              created_at: '',
              created_by: ''
            };
            
            const taskLabels = task.entity_labels
              ?.map((el) => el.labels)
              .filter((label): label is NonNullable<typeof label> => label !== null) || [];
              
            return (
              <DraggableTaskCard
                key={task.id}
                task={task}
                status={status}
                priority={taskPriority}
                labels={taskLabels}
                assignees={task.entity_assignees?.map((ea) => ({
                  id: ea.user_id,
                  name: ea.users.raw_user_meta_data.name,
                  avatar_url: ea.users.raw_user_meta_data.avatar_url,
                })) ?? []}
                allStatuses={allStatuses}
                allPriorities={allPriorities}
                refreshTasks={refreshTasks}
                isDragging={activeTaskId === task.id}
                isAddTaskDrawerOpen={isAddTaskDrawerOpen}
              />
            );
          })}
          
          {/* Placeholder for the dragged task */}
          {isOver && isDragging && (
            <div 
              className="absolute bottom-4 left-4 right-4 transition-opacity duration-300 animate-in fade-in"
              style={{ height: `${dragCardHeight}px` }}
            >
              <DragPlaceholder />
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
} 