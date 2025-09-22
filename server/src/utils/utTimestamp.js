import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(timezone);

const getTimestamp = (tz = Intl.DateTimeFormat().resolvedOptions().timeZone) =>
  dayjs().tz(tz).format('YYYY-MM-DD HH:mm:ss.SSS');

export default getTimestamp;