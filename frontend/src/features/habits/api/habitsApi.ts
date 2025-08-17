import { endOfWeek, format, isSameDay, startOfMonth, startOfWeek } from 'date-fns';

import { useMutation, useQuery, useQueryClient } from 'react-query';

import { client } from '../../../store/api/emptyAxiosApi';
import { CreateHabitLogRequest, CreateHabitRequest, CreateHabitResponse, DeleteHabitRequest, Habit, HabitCalendarDataItem, HabitLog, ReorderHabitsRequest, UpdateHabitRequest } from '../types';

export const SIMPLE_DATE_FORMAT = 'yyyy-MM-dd';

export const habitsQueryKey = ['habits'];

export const useGetHabitsSummaryQuery = (startDate: string, endDate: string, userId: string) => {
    return useQuery<Habit[]>(
        [...habitsQueryKey, startDate, endDate],
        async () => {
            const { data } = await client.get<Habit[]>(`/habits/summary?startDate=${startDate}&endDate=${endDate}&userId=${userId}`);

            return data;
        },
        {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 10 * 60 * 1000 // 10 minutes
        }
    );
};

export const useGetAllHabitsQuery = () => {
    return useQuery<Habit[]>([...habitsQueryKey, 'all'], async () => {
        const { data } = await client.get<Habit[]>('/habits/all');

        return data;
    });
};

export const useGetArchivedHabitsQuery = () => {
    return useQuery<Habit[]>([...habitsQueryKey, 'archived'], async () => {
        const { data } = await client.get<Habit[]>('/habits/archived');

        return data;
    });
};

export const useGetHabitQuery = (habitId: string) => {
    return useQuery<Habit>(
        [...habitsQueryKey, habitId],
        async () => {
            const { data } = await client.get<Habit>(`/habits/${habitId}`);

            return data;
        },
        {
            enabled: !!habitId
        }
    );
};

export const useUpdateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ _id, ...payload }: UpdateHabitRequest) => client.put(`/habits/${_id}`, payload),
        {
            onSuccess: (_, { _id }) => {
                queryClient.invalidateQueries([...habitsQueryKey, _id]);
                queryClient.invalidateQueries(habitsQueryKey);
            }
        }
    );
};

export const useCreateHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload: CreateHabitRequest) => client.post<CreateHabitResponse>('/habits', payload),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(habitsQueryKey);
            }
        }
    );
};

export const useReorderHabitsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (data: ReorderHabitsRequest) => client.post('/habits/reorder', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(habitsQueryKey);
            }
        }
    );
};

export const useDeleteHabitMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ _id }: DeleteHabitRequest) => client.delete(`/habits/${_id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(habitsQueryKey);
            }
        }
    );
};

// TODO: delete a log

// Helper function to calculate updated metrics
const calculateUpdatedMetrics = (habit: Habit, currentLog: HabitLog | null, newLog: CreateHabitLogRequest, isToday: boolean) => {
    const wasCompletedBefore = !!currentLog && currentLog.percentageCompleted >= 100;
    const isCompleted = newLog.percentageCompleted >= 100;

    let currentStreak = habit.cachedMetrics.currentStreak;
    let longestStreak = habit.cachedMetrics.longestStreak;
    let overallCompletions = habit.cachedMetrics.overallCompletions;

    // Update overallCompletions for any date
    if (isCompleted && !wasCompletedBefore) {
        // Add to overall completions
        overallCompletions += 1;
    } else if (!isCompleted && wasCompletedBefore) {
        // Remove from overall completions
        if (overallCompletions > 0) overallCompletions -= 1;
    }

    // Update streak only for today's logs
    if (isToday) {
        if (isCompleted && !wasCompletedBefore) {
            // Increment streak
            currentStreak += 1;

            // Update longest streak if current streak is bigger
            if (currentStreak > longestStreak) {
                longestStreak = currentStreak;
            }
        } else if (!isCompleted && wasCompletedBefore) {
            // Decrement streak
            if (currentStreak > 0) currentStreak -= 1;
        }
    }

    return {
        currentStreak,
        longestStreak,
        overallCompletions
    };
};

export const useCreateOrUpdateHabitLogMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (payload: CreateHabitLogRequest) => client.post<{ habitLog: HabitLog }>(`/habits/${payload.habitId}/logs?date=${format(new Date(payload.date), SIMPLE_DATE_FORMAT)}`, payload),
        {
            onMutate: async (newLog) => {
                // Cancel any outgoing refetches
                await queryClient.cancelQueries([...habitsQueryKey, newLog.habitId]);
                await queryClient.cancelQueries(habitsQueryKey);

                // Cancel calendar queries
                await queryClient.cancelQueries([...habitsQueryKey, newLog.habitId, 'calendar']);

            // Snapshot the current state
            const previousHabitState = queryClient.getQueryData<Habit>([...habitsQueryKey, newLog.habitId]);

            const startOfWeekDate = startOfWeek(newLog.date, {
                weekStartsOn: 1
            });
            const endOfWeekDate = endOfWeek(newLog.date, {
                weekStartsOn: 1
            });

            const summaryQueryKey = [...habitsQueryKey, format(startOfWeekDate, SIMPLE_DATE_FORMAT), format(endOfWeekDate, SIMPLE_DATE_FORMAT)];

            const previousHabits = queryClient.getQueryData<Habit[]>(summaryQueryKey);

            // Get calendar data for the month of the log
            const logMonth = startOfMonth(new Date(newLog.date));
            const previousCalendarData = queryClient.getQueryData<Record<string, HabitCalendarDataItem>>([...habitsQueryKey, newLog.habitId, 'calendar', logMonth]);

            // Create a temporary ID for the new log
            const tempId = `temp-${Date.now()}`;

            // Check if this is for today's date
            const isToday = isSameDay(newLog.date, new Date());

            // Format date for calendar key
            const formattedDate = format(new Date(newLog.date), SIMPLE_DATE_FORMAT);

            // Update calendar data if it exists
            if (previousCalendarData) {
                queryClient.setQueryData<Record<string, HabitCalendarDataItem>>([...habitsQueryKey, newLog.habitId, 'calendar', logMonth], (oldData) => {
                    if (!oldData) return oldData;

                    // Create updated calendar item
                    const updatedItem: HabitCalendarDataItem = {
                        ...(oldData[formattedDate] || {
                            date: formattedDate,
                            isOptional: false,
                            streakState: {
                                displayLeftLine: false,
                                displayRightLine: false
                            }
                        }),
                        percentageCompleted: newLog.percentageCompleted,
                        amount: newLog.amount,
                        note: newLog.note,
                        isManuallyOptional: newLog.isManuallyOptional
                    };

                    return {
                        ...oldData,
                        [formattedDate]: updatedItem
                    };
                });
            }

            // Update the specific habit query
            if (previousHabitState) {
                queryClient.setQueryData<Habit>([...habitsQueryKey, newLog.habitId], (oldHabit) => {
                    if (!oldHabit) return oldHabit;

                    // Get current log for this date if it exists in featuredLogs
                    const currentLogIndex = oldHabit.featuredLogs?.findIndex((log) => isSameDay(log.date, newLog.date));

                    const currentLog = currentLogIndex !== -1 && currentLogIndex !== undefined ? oldHabit.featuredLogs[currentLogIndex] : null;

                    // Calculate metrics updates
                    const updatedMetrics = calculateUpdatedMetrics(oldHabit, currentLog, newLog, isToday);

                    // Create updated featuredLogs
                    const updatedFeaturedLogs = [...(oldHabit.featuredLogs || [])];

                    if (currentLogIndex !== -1 && currentLogIndex !== undefined) {
                        // Update existing log
                        updatedFeaturedLogs[currentLogIndex] = {
                            ...updatedFeaturedLogs[currentLogIndex],
                            ...newLog,
                            _id: updatedFeaturedLogs[currentLogIndex]._id
                        };
                    } else {
                        // Add new log
                        updatedFeaturedLogs.push({
                            ...newLog,
                            _id: tempId
                        } as HabitLog);
                    }

                    return {
                        ...oldHabit,
                        featuredLogs: updatedFeaturedLogs,
                        cachedMetrics: {
                            ...oldHabit.cachedMetrics,
                            ...updatedMetrics
                        }
                    };
                });
            }

            // Update the summary query data
            if (previousHabits) {
                queryClient.setQueryData<Habit[]>(summaryQueryKey, (oldHabits) => {
                    if (!oldHabits) return oldHabits;

                    return oldHabits.map((habit) => {
                        if (habit._id !== newLog.habitId) return habit;

                        // Get current log for this date if it exists in featuredLogs
                        const currentLogIndex = habit.featuredLogs?.findIndex((log) => isSameDay(log.date, newLog.date));

                        const currentLog = currentLogIndex !== -1 && currentLogIndex !== undefined ? habit.featuredLogs[currentLogIndex] : null;

                        // Calculate metrics updates
                        const updatedMetrics = calculateUpdatedMetrics(habit, currentLog, newLog, isToday);

                        // Create updated featuredLogs
                        const updatedFeaturedLogs = [...(habit.featuredLogs || [])];

                        if (currentLogIndex !== -1 && currentLogIndex !== undefined) {
                            // Update existing log
                            updatedFeaturedLogs[currentLogIndex] = {
                                ...updatedFeaturedLogs[currentLogIndex],
                                ...newLog,
                                _id: updatedFeaturedLogs[currentLogIndex]._id
                            };
                        } else {
                            // Add new log
                            updatedFeaturedLogs.push({
                                ...newLog,
                                _id: tempId
                            } as HabitLog);
                        }

                        return {
                            ...habit,
                            featuredLogs: updatedFeaturedLogs,
                            cachedMetrics: {
                                ...habit.cachedMetrics,
                                ...updatedMetrics
                            }
                        };
                    });
                });
            }

            return {
                previousHabitState,
                previousHabits,
                previousCalendarData,
                logMonth,
                habitId: newLog.habitId,
                tempId
            };
        },

        onError: (_, __, context) => {
            // Revert to previous state if mutation fails
            if (context?.previousHabitState) {
                queryClient.setQueryData([...habitsQueryKey, context.previousHabitState._id], context.previousHabitState);
            }

            if (context?.previousHabits) {
                queryClient.setQueryData(habitsQueryKey, context.previousHabits);
            }

            // Revert calendar data
            if (context?.previousCalendarData && context?.logMonth) {
                queryClient.setQueryData([...habitsQueryKey, context.habitId, 'calendar', context.logMonth], context.previousCalendarData);
            }
        },

            onSettled: (_, __, variables) => {
                // Always invalidate queries after mutation settles
                queryClient.invalidateQueries([...habitsQueryKey, variables.habitId]);
                queryClient.invalidateQueries(habitsQueryKey);
                queryClient.invalidateQueries([...habitsQueryKey, variables.habitId, 'calendar']);
            }
    });
};

export const useGetHabitCalendarDataQuery = (habitId: string, monthDate: Date) => {
    return useQuery<Record<string, HabitCalendarDataItem>>(
        [...habitsQueryKey, habitId, 'calendar', monthDate],
        async () => {
            const { data } = await client.get<Record<string, HabitCalendarDataItem>>(`/habits/${habitId}/calendar?month=${format(new Date(monthDate), 'yyyy-MM')}`);

            return data;
        }
    );
};

export const habitsApi = {
    useGetHabitsSummaryQuery,
    useGetHabitQuery,
    useUpdateHabitMutation,
    useCreateHabitMutation,
    useReorderHabitsMutation,
    useDeleteHabitMutation,
    useCreateOrUpdateHabitLogMutation,
    useGetHabitCalendarDataQuery
};
