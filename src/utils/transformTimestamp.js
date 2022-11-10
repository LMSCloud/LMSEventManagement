export default function transformTimestamp(timestamp) {
  // TODO: Extract handlers for different locales to a class which is instantiated once
  const [date, time] = timestamp.split(' ');
  const [year, month, day] = date.split('-');
  const [hours, minutes] = time.split(':');

  if (window.navigator.language === 'de-DE') {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  if (window.navigator.language === 'en-US') {
    return `${month}/${day}/${year} ${parseInt(hours, 10) > 12 ? hours - 12 : hours}:${minutes} ${hours > 12 ? 'p.m.' : 'a.m.'}`;
  }

  if (window.navigator.language === 'en-GB') {
    return `${day}/${month}/${year} ${parseInt(hours, 10) > 12 ? hours - 12 : hours}.${minutes} ${hours > 12 ? 'p.m.' : 'a.m.'}`;
  }

  return timestamp;
}
