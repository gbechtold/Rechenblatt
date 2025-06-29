import { useTranslation } from 'next-i18next';

interface ProblemFiltersProps {
  suppressTrivial: boolean;
  avoidDuplicates: boolean;
  onSuppressTrivialChange: (value: boolean) => void;
  onAvoidDuplicatesChange: (value: boolean) => void;
}

export function ProblemFilters({
  suppressTrivial,
  avoidDuplicates,
  onSuppressTrivialChange,
  onAvoidDuplicatesChange,
}: ProblemFiltersProps) {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t('filters.title')}</h3>
      
      <div className="space-y-3">
        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={suppressTrivial}
            onChange={(e) => onSuppressTrivialChange(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <div>
            <div className="font-medium">{t('filters.suppressTrivial')}</div>
            <div className="text-sm text-gray-600">{t('filters.suppressTrivialDesc')}</div>
          </div>
        </label>

        <label className="flex items-start space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={avoidDuplicates}
            onChange={(e) => onAvoidDuplicatesChange(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <div>
            <div className="font-medium">{t('filters.avoidDuplicates')}</div>
            <div className="text-sm text-gray-600">{t('filters.avoidDuplicatesDesc')}</div>
          </div>
        </label>
      </div>
    </div>
  );
}