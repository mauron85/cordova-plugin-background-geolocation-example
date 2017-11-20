import { padLeft, logFormatter } from './logFormatter';
import androidLogFormatter from './index.android';
import iosLogFormatter from './index.ios';

var logFormat = function(logEntry) {
  var d = new Date(Number(logEntry.timestamp));
  var dateStr = [d.getFullYear(), padLeft(d.getMonth()+1,2), padLeft(d.getDate(),2)].join('/');
  var timeStr = [padLeft(d.getHours(),2), padLeft(d.getMinutes(),2), padLeft(d.getSeconds(),2)].join(':');
  return {
    id: logEntry.timestamp,
    style: { backgroundColor:'white',color:'black' },
    text: ['[', dateStr, ' ', timeStr, ']\t', logEntry.message].join('')
  };
}

export default function formatter(logEntries) {
  if (device && device.platform) {
    if (/ios/i.test(device.platform)) {
      return iosLogFormatter(logEntries);
    }
    if (/android/i.test(device.platform)) {
      return androidLogFormatter(logEntries);
    }
  }

  return logFormatter(logEntries, logFormat);
}
