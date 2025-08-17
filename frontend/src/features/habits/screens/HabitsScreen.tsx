import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useState } from 'react';


import HeaderBar from '../../../components/HeaderBar';
import Typography from '../../../components/Typography';
// import { useAppNavigation } from '../../../modules/navigation/NavigationService';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/UI/Loading';
import { useAppSelector } from '../../../store/helpers/storeHooks';
import { getUserId } from '../../user/userSlice';
import { SIMPLE_DATE_FORMAT, useGetHabitsSummaryQuery } from '../api/habitsApi';
import HabitItem from '../components/habitItem/HabitItem';
import HabitsProgressBar from '../components/habitsHeader/HabitsProgressBar';
import HabitsWeekCalendar from '../components/habitsHeader/HabitsWeekCalendar';

const contentContainerStyle = {
    paddingTop: 20,
    paddingBottom: 90,
    paddingHorizontal: 16
};

const HabitsScreen = (): JSX.Element => {
    const navigate = useNavigate();

    const userId = useAppSelector(getUserId);
    const [selectedDate, setSelectedDate] = useState(new Date().getTime());

    const { data: activeHabits = [], isLoading } = useGetHabitsSummaryQuery(
        format(startOfWeek(selectedDate, { weekStartsOn: 1 }), SIMPLE_DATE_FORMAT),
        format(endOfWeek(selectedDate, { weekStartsOn: 1 }), SIMPLE_DATE_FORMAT),
        userId ?? ''
    );

    // const navigateToCreateHabitScreen = useCallback(() => {
    //     navigation.navigate(Routes.EDIT_HABIT);
    // }, [navigation]);

    return (
        <>
            <HeaderBar
                leadingContent={(textColor) => (
                    <div onClick={() => navigate('/')}>
                        <MdArrowBack size={26} color={textColor} />
                    </div>
                )}
                title="Habits"
                className="[&>div>h1]:text-xl !py-3 bg-gradient-to-b from-[#0e7490] to-[#094758]"
                trailingContent={() => <div />}
                // trailingContent={(textColor) => (
                //   <>
                //     <ButtonContainers
                // onClick={() => navigation.navigate(Routes.ARCHIVED_HABITS)}
                //       className="cursor-pointer"
                //     >
                //       <MdArchive size={26} color={textColor} />
                //     </ButtonContainers>
                //     <ButtonContainer
                // onClick={() => navigation.navigate(Routes.HABITS_BULK_EDIT)}
                //       className="cursor-pointer"
                //     >
                //       <MdFilter size={30} color={textColor} />
                //     </ButtonContainer>
                //   </>
                // )}
            />
            <HabitsProgressBar selectedDate={selectedDate} mandatoryHabits={activeHabits} />
            {/* <AddButton contentItem={ContentItem.HABIT} /> */}
            <div className="flex-1 px-4 bg-gradient-to-b from-[#D4E0F1] via-[#d0dae8] to-[#D4E0F1]">
                <div className="overflow-y-auto" style={contentContainerStyle}>
                    <HabitsWeekCalendar activeHabits={activeHabits} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />

                    {isLoading ? (
                        <div className="pt-2 flex justify-center">
                            <Loading className="my-4" />
                        </div>
                    ) : activeHabits.length > 0 ? (
                        <>
                            {activeHabits.map((habit) => (
                                <HabitItem key={habit._id} habit={habit} selectedDate={selectedDate} />
                            ))}
                        </>
                    ) : (
                        <div className="flex flex-col items-center">
                            <Typography fontWeight="semibold" fontSize="lg">
                                No habits yet
                            </Typography>
                            {/* <Button label="Add Habit" marginTop={10} labelProps={{ fontSize: 'xl', fontWeight: 'bold' }} onClick={navigateToCreateHabitScreen} bgColor="#0891b2" /> */}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// const ButtonContainer = ({ children, ...props }: any) => (
//   <button
//     {...props}
//     className="flex items-center justify-center p-2 hover:bg-white/10 rounded transition-colors"
//   >
//     {children}
//   </button>
// );

export default HabitsScreen;
