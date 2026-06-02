/**
 * EcoTrack Letter Grade Helper
 * Formats colors, feedback texts, and badges based on the calculated CO2 grade.
 */
export const getGradeMeta = (grade) => {
  const meta = {
    A: {
      label: 'Excellent',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-500/20',
      ringColor: 'emerald',
      description: 'Your carbon output is exceptionally low. You are living highly sustainably!'
    },
    B: {
      label: 'Eco-Friendly',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-500/20',
      ringColor: 'green',
      description: 'Well done! You are keeping your footprint below international limits.'
    },
    C: {
      label: 'Moderate',
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-500/20',
      ringColor: 'amber',
      description: 'Your score is moderate. There are simple opportunities to trim down your carbon waste.'
    },
    D: {
      label: 'High Intensity',
      color: 'text-orange-500 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-500/20',
      ringColor: 'orange',
      description: 'Your carbon emissions are above ideal benchmarks. Check tips for quick improvements.'
    },
    E: {
      label: 'Heavy Footprint',
      color: 'text-rose-500 dark:text-rose-450',
      bgColor: 'bg-rose-50 dark:bg-rose-950/20',
      borderColor: 'border-rose-500/20',
      ringColor: 'rose',
      description: 'Your output is significant. Red meat consumption or home energy use is likely high.'
    },
    F: {
      label: 'Critical',
      color: 'text-red-600 dark:text-red-405',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-500/20',
      ringColor: 'red',
      description: 'Your emission is critical. Action is highly recommended to scale down your travel or heating usage.'
    }
  };

  return meta[grade] || meta.C;
};

export default getGradeMeta;
