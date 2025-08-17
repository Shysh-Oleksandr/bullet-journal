import { format, isAfter, startOfToday } from 'date-fns';
import { useMemo } from 'react';

import Typography from '../../../../components/Typography';
import theme from '../../../../theme';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const today = startOfToday();

const CIRCLE_SIZE = 36;
const CIRCLE_WIDTH = 13;

const BG_GRADIENT_COLORS = [theme.colors.darkSkyBlue, theme.colors.cyan500] as const;

type Props = {
    date: number;
    percentageCompleted: number;
    isActive: boolean;
    setSelectedDate: (val: number) => void;
};

const WeekCalendarItem = ({ date, percentageCompleted, isActive, setSelectedDate }: Props): JSX.Element => {
    const isDisabled = isAfter(date, today);
    const isCompleted = percentageCompleted >= 100;

    const day = format(date, 'EEEEEE');

    const bgColor = useMemo(() => {
        if (isDisabled) return '#add5d9';
        if (isCompleted) return '#06b6d4';

        return '#ebfbfc';
    }, [isCompleted, isDisabled]);

    return (
        <button className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled={isDisabled} onClick={() => setSelectedDate(date)}>
            {isActive ? (
                <div
                    className="rounded-xl w-10 h-10 flex items-center justify-center"
                    style={{
                        background: `linear-gradient(135deg, ${BG_GRADIENT_COLORS.join(', ')})`
                    }}
                >
                    <Typography fontSize="xs" fontWeight="semibold" color="#fff" uppercase>
                        {day}
                    </Typography>
                </div>
            ) : (
                <div style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
                    <CircularProgressbar
                        value={percentageCompleted}
                        strokeWidth={CIRCLE_WIDTH}
                        text={day}
                        background
                        styles={{
                            background: {
                                fill: bgColor
                            },
                            text: {
                                fontSize: '30px',
                                fontWeight: 'bold',
                                fill: isCompleted ? theme.colors.white : theme.colors.darkBlueText,
                                textTransform: 'uppercase',
                                textAlign: 'center'
                            },
                            path: {
                                stroke: theme.colors.cyan500
                            },
                            trail: {
                                stroke: theme.colors.crystal
                            }
                        }}
                    />
                </div>
            )}
        </button>
    );
};

export default WeekCalendarItem;
