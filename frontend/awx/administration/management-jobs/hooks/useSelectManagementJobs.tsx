import { useTranslation } from 'react-i18next';
import { SelectSingleDialog } from '../../../../../framework/PageDialogs/SelectSingleDialog';
import { useAwxView } from '../../../useAwxView';
import { awxAPI } from '../../../api/awx-utils';
import { useManagementJobColumns } from './useManagementJobColumns';
import { useManagementJobFilters } from './useManagementJobFilters';

import { usePageDialog } from '../../../../../framework';
import { useCallback } from 'react';
import { SystemJobTemplate } from '../../../interfaces/SystemJobTemplate';

function SelectManagementJob(props: {
  title: string;
  onSelect: (template: SystemJobTemplate) => void;
}) {
  const toolbarFilters = useManagementJobFilters();
  const tableColumns = useManagementJobColumns({ disableLinks: true });
  const view = useAwxView<SystemJobTemplate>({
    url: awxAPI`/job_templates/`,
    toolbarFilters,
    tableColumns,
    disableQueryString: true,
  });
  return (
    <SelectSingleDialog<SystemJobTemplate>
      {...props}
      toolbarFilters={toolbarFilters}
      tableColumns={tableColumns}
      view={view}
    />
  );
}

export function useSelectManagementJobs() {
  const [_, setDialog] = usePageDialog();
  const { t } = useTranslation();
  const openSelectSystemJob = useCallback(
    (onSelect: (template: SystemJobTemplate) => void) => {
      setDialog(<SelectManagementJob title={t('Select a system job')} onSelect={onSelect} />);
    },
    [setDialog, t]
  );
  return openSelectSystemJob;
}