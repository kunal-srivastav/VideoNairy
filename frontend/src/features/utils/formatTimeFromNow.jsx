import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatTimeFromNow = (date) => {
    return dayjs(date).fromNow();
}
