import { Button } from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { useTranslation } from 'react-i18next';

export function AddNodeButton(props: { variant?: 'primary' | 'secondary' }) {
  const { t } = useTranslation();
  return (
    <Button
      data-cy="add-node-button"
      icon={<PlusCircleIcon />}
      variant={props.variant || 'secondary'}
      label={t('Add node')}
      onClick={() => {}}
    >
      {t('Add node')}
    </Button>
  );
}
