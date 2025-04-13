'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Pencil, Check, Plus, Trash2, GripVertical, CircleDot, CheckSquare } from 'lucide-react';
import { getFormById, updateForm } from '@/lib/api/forms';
import { FormResponse, FormItem, ItemType } from '@/lib/types/form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableQuestionCard } from '@/components/forms/sortable-question-card';
import { FormBuilderQuestion } from '@/lib/types/form-builder';

const questionTypes = [
  { value: 'question', label: 'Short answer' },
  { value: 'radio_box', label: 'Multiple choice' },
  { value: 'checklist', label: 'Checkboxes' },
  { value: 'photo', label: 'Photo' },
] as const;

// Adapter functions to convert between FormItem and FormBuilderQuestion
const toFormBuilderQuestion = (item: FormItem): FormBuilderQuestion => ({
  id: item.id?.toString() || item.display_order.toString(),
  type: item.item_type,
  title: item.question_value,
  options: item.options,
  required: item.is_required,
});

const fromFormBuilderQuestion = (
  question: FormBuilderQuestion,
  displayOrder: number,
): Omit<FormItem, 'id' | 'form_id'> => ({
  item_type: question.type,
  question_value: question.title,
  options: question.options,
  is_required: question.required,
  display_order: displayOrder,
});

export default function FormDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [form, setForm] = useState<FormResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedItems, setEditedItems] = useState<FormItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await getFormById(parseInt(resolvedParams.id));
        setForm(data);
        setEditedTitle(data?.form.name || '');
        setEditedItems(data?.items || []);
      } catch (error) {
        console.error('Error fetching form:', error);
        toast.error('Failed to load form');
      } finally {
        setIsLoading(false);
      }
    };

    fetchForm();
  }, [resolvedParams.id]);

  const hasChanges = () => {
    if (!form) return false;

    // Check if title has changed
    if (editedTitle.trim() !== form.form.name) return true;

    // Check if number of items has changed
    if (editedItems.length !== form.items.length) return true;

    // Check if any items have changed
    return editedItems.some((editedItem, index) => {
      const originalItem = form.items[index];
      if (!originalItem) return true;

      return (
        editedItem.question_value !== originalItem.question_value ||
        editedItem.item_type !== originalItem.item_type ||
        editedItem.is_required !== originalItem.is_required ||
        editedItem.display_order !== originalItem.display_order ||
        // Compare options arrays
        JSON.stringify(editedItem.options) !== JSON.stringify(originalItem.options)
      );
    });
  };

  const handleSave = async () => {
    if (!form) return;

    // Check if there are any changes
    if (!hasChanges()) {
      setIsEditing(false);
      toast.info('No changes to save');
      return;
    }

    try {
      setIsSaving(true);

      // Prepare items by excluding id and form_id
      const itemsToUpdate = editedItems.map(({ id, form_id, ...item }) => ({
        ...item,
        display_order: item.display_order || 0, // Ensure display_order is set
      }));

      await updateForm(parseInt(resolvedParams.id), {
        name: editedTitle.trim(),
        items: itemsToUpdate,
      });

      // Update local state
      setForm({
        ...form,
        form: {
          ...form.form,
          name: editedTitle.trim(),
        },
        items: editedItems,
      });

      setIsEditing(false);
      toast.success('Form updated successfully');
    } catch (error) {
      console.error('Error updating form:', error);
      toast.error('Failed to update form');
    } finally {
      setIsSaving(false);
    }
  };

  const updateQuestion = (id: string, updates: Partial<FormBuilderQuestion>) => {
    const index = editedItems.findIndex(
      (item) => item.id?.toString() === id || item.display_order.toString() === id,
    );

    if (index === -1) return;

    setEditedItems((items) =>
      items.map((item, i) =>
        i === index
          ? {
              ...item,
              item_type: updates.type || item.item_type,
              question_value: updates.title || item.question_value,
              options: updates.options || item.options,
              is_required: updates.required ?? item.is_required,
            }
          : item,
      ),
    );
  };

  const deleteQuestion = (id: string) => {
    const index = editedItems.findIndex(
      (item) => item.id?.toString() === id || item.display_order.toString() === id,
    );
    if (index === -1) return;
    setEditedItems((items) => items.filter((_, i) => i !== index));
  };

  const getStatusColor = () => {
    if (!form) return 'bg-muted text-muted-foreground';
    if (form.form.is_synced) {
      return 'bg-green-500/10 text-green-700 dark:text-green-400';
    } else if (form.form.assigned_to?.length) {
      return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    } else {
      return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = () => {
    if (!form) return 'Loading...';
    if (form.form.is_synced) {
      return 'Completed';
    } else if (form.form.assigned_to?.length) {
      return 'In Progress';
    } else {
      return 'Draft';
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEditedItems((items) => {
        const oldIndex = items.findIndex(
          (item) => (item.id?.toString() || item.display_order.toString()) === active.id,
        );
        const newIndex = items.findIndex(
          (item) => (item.id?.toString() || item.display_order.toString()) === over.id,
        );
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          display_order: index,
        }));
      });
    }
  };

  const addQuestion = () => {
    const newQuestion: FormItem = {
      item_type: 'question',
      question_value: '',
      options: [],
      is_required: false,
      display_order: editedItems.length,
    };
    setEditedItems([...editedItems, newQuestion]);
  };

  const handleClose = () => {
    setIsClosing(true);
    // Add delay to match animation duration before navigating back
    setTimeout(() => {
      router.push('/protected/forms');
    }, 300);
  };

  return (
    <Sheet
      open={true}
      onOpenChange={() => {
        if (isEditing) {
          if (hasChanges()) {
            if (confirm('You have unsaved changes. Are you sure you want to discard them?')) {
              setIsEditing(false);
              setEditedTitle(form?.form.name || '');
              setEditedItems(form?.items || []);
            }
          } else {
            setIsEditing(false);
            setEditedTitle(form?.form.name || '');
            setEditedItems(form?.items || []);
          }
        } else {
          handleClose();
        }
      }}
      modal={false}
    >
      <SheetContent
        className={`h-full !w-[40vw] !max-w-[40vw] border-l p-0 transition-transform duration-300 focus:outline-none focus-visible:outline-none [&>button]:hidden ${
          isClosing ? 'translate-x-full' : 'translate-x-0'
        }`}
        side="right"
      >
        {isLoading ? (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-6">
              <div className="space-y-1">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Questions</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 animate-pulse rounded bg-muted" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !form ? (
          <div className="flex h-full items-center justify-center">
            <p>Form not found</p>
          </div>
        ) : (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b p-6">
              <div className="space-y-1">
                {isEditing ? (
                  <div className="relative">
                    <Input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="border-input bg-background px-3 py-2 text-2xl font-semibold hover:border-primary/50 focus-visible:ring-1"
                      aria-label="Form title"
                      placeholder="Enter form title"
                    />
                    <Pencil className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                ) : (
                  <h2 className="text-2xl font-semibold">{form.form.name}</h2>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor()}>
                    {getStatusText()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Last updated{' '}
                    {form.form.updated_at
                      ? format(new Date(form.form.updated_at), 'MMM d, yyyy')
                      : 'Never'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  disabled={isSaving}
                >
                  {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isEditing) {
                      if (hasChanges()) {
                        if (
                          confirm(
                            'You have unsaved changes. Are you sure you want to discard them?',
                          )
                        ) {
                          setIsEditing(false);
                          setEditedTitle(form?.form.name || '');
                          setEditedItems(form?.items || []);
                        }
                      } else {
                        setIsEditing(false);
                        setEditedTitle(form?.form.name || '');
                        setEditedItems(form?.items || []);
                      }
                    } else {
                      handleClose();
                    }
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="space-y-6 p-6">
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Questions</h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={editedItems.map(
                            (item) => item.id?.toString() || item.display_order.toString(),
                          )}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-4">
                            {editedItems.map((item, index) => (
                              <SortableQuestionCard
                                key={item.id || index}
                                question={toFormBuilderQuestion(item)}
                                onUpdate={updateQuestion}
                                onDelete={deleteQuestion}
                                isFirst={index === 0}
                                isEditing={isEditing}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    ) : (
                      <div className="space-y-4">
                        {editedItems.map((item, index) => (
                          <SortableQuestionCard
                            key={item.id || index}
                            question={toFormBuilderQuestion(item)}
                            onUpdate={updateQuestion}
                            onDelete={deleteQuestion}
                            isFirst={index === 0}
                            isEditing={isEditing}
                          />
                        ))}
                      </div>
                    )}

                    {isEditing && (
                      <Button variant="outline" className="mt-4 w-full" onClick={addQuestion}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add question
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold">Assignments</h3>
                  <div className="rounded-lg border p-4">
                    {form.form.assigned_to && form.form.assigned_to.length > 0 ? (
                      <p>{form.form.assigned_to.length} user(s) assigned</p>
                    ) : (
                      <p className="text-muted-foreground">No users assigned</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
