
// Format minutes into hours and minutes
export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins}分钟`;
  }
  
  return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
};
