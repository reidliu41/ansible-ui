import {
    Breadcrumb,
    BreadcrumbItem,
    Bullseye,
    Button,
    Flex,
    FlexItem,
    PageNavigation,
    PageSection,
    PageSectionVariants,
    Popover,
    Skeleton,
    Stack,
    StackItem,
    Text,
    Title,
    Truncate,
} from '@patternfly/react-core'
import { ExternalLinkAltIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons'
import { CSSProperties, Fragment, ReactNode } from 'react'
import { useHistory } from 'react-router-dom'
import { useWindowSizeOrLarger, WindowSize } from './components/useBreakPoint'
import { useSettings } from './Settings'

export interface ICatalogBreadcrumb {
    id?: string
    label?: string
    to?: string
    target?: string
    component?: React.ElementType
}

function Breadcrumbs(props: { breadcrumbs: ICatalogBreadcrumb[]; style?: CSSProperties }) {
    const history = useHistory()
    if (!props.breadcrumbs) return <Fragment />
    return (
        <Breadcrumb style={props.style}>
            {props.breadcrumbs.map((breadcrumb) => {
                if (!breadcrumb.label) return <></>
                return (
                    <BreadcrumbItem
                        id={breadcrumb.id}
                        key={breadcrumb.id ?? breadcrumb.label}
                        component={breadcrumb.component}
                        onClick={breadcrumb.to ? () => breadcrumb.to && history.push(breadcrumb.to) : undefined}
                        style={{
                            color: breadcrumb.to ? 'var(--pf-c-breadcrumb__link--Color)' : undefined,
                            cursor: breadcrumb.to ? 'pointer' : undefined,
                        }}
                        isActive={breadcrumb.to === undefined}
                    >
                        {breadcrumb.label}
                    </BreadcrumbItem>
                )
            })}
        </Breadcrumb>
    )
}

export interface PageHeaderProps {
    navigation?: ReactNode
    breadcrumbs?: ICatalogBreadcrumb[]
    title?: string
    titleHelpTitle?: string
    titleHelp?: ReactNode
    titleDocLink?: string
    description?: string
    controls?: ReactNode
    headerActions?: ReactNode
    t?: (t: string) => string
}

/**
 * PageHeader enables the responsive layout of the header.
 *
 * @param {Breadcrumb[]} breadcrumbs - The breadcrumbs for the page.
 * @param {string} title - The title of the page.
 * @param {string} titleHelpTitle - The title of help popover.
 * @param {ReactNode} titleHelp - The content for the help popover.
 * @param {string} description - The description of the page.
 * @param {ReactNode} controls - Support for extra page controls.
 * @param {ReactNode} headerActions - The actions for the page.
 *
 * @example
 * <Page>
 *   <PageLayout>
 *     <PageHeader
 *       breadcrumbs={[{ label: 'Home', to: '/home' }, { label: 'Page title' }]}
 *       title='Page title'
 *       description='Page description'
 *       headerActions={<PageActions actions={actions} />}
 *     />
 *     <PageBody />...</PageBody>
 *   </PageLayout>
 * <Page>
 */
export function PageHeader(props: PageHeaderProps) {
    const { navigation, breadcrumbs, title, description, controls, headerActions: pageActions } = props
    const xl = useWindowSizeOrLarger(WindowSize.xl)
    const isMdOrLarger = useWindowSizeOrLarger(WindowSize.md)
    const isSmLarger = useWindowSizeOrLarger(WindowSize.sm)
    const settings = useSettings()
    let { t } = props
    t = t ? t : (t: string) => t
    return (
        <>
            {navigation && (
                <PageSection
                    variant={PageSectionVariants.light}
                    style={{
                        paddingLeft: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderBottom: settings.borders ? 'thin solid var(--pf-global--BorderColor--100)' : undefined,
                    }}
                >
                    <Flex direction={{ default: 'row' }} flexWrap={{ default: 'nowrap' }} style={{ maxWidth: '100%' }}>
                        <PageNavigation style={{ paddingTop: 0, flexShrink: 1, flexGrow: 1 }} hasOverflowScroll>
                            {navigation}
                        </PageNavigation>
                        {!isMdOrLarger && props.titleDocLink && (
                            <FlexItem>
                                <Bullseye>
                                    <Button
                                        icon={<ExternalLinkAltIcon style={{ paddingRight: 4, paddingTop: 4 }} />}
                                        variant="link"
                                        onClick={() => window.open(props.titleDocLink, '_blank')}
                                        isInline
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {isSmLarger ? <span>{t('Documentation')}</span> : <span>{'Docs'}</span>}
                                    </Button>
                                </Bullseye>
                            </FlexItem>
                        )}
                    </Flex>
                </PageSection>
            )}
            {(isMdOrLarger || !navigation) && (
                <PageSection
                    variant={PageSectionVariants.light}
                    style={{
                        paddingTop: breadcrumbs ? (xl ? 16 : 12) : xl ? 16 : 8,
                        paddingBottom: xl ? 20 : 12,
                        borderBottom: settings.borders ? 'thin solid var(--pf-global--BorderColor--100)' : undefined,
                    }}
                >
                    <Flex flexWrap={{ default: 'nowrap' }} alignItems={{ default: 'alignItemsStretch' }}>
                        <FlexItem grow={{ default: 'grow' }}>
                            {breadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} style={{ paddingBottom: xl ? 4 : 2 }} />}
                            {title ? (
                                props.titleHelp ? (
                                    <Popover
                                        headerContent={props.titleHelpTitle}
                                        bodyContent={
                                            <Stack hasGutter>
                                                <StackItem>{props.titleHelp}</StackItem>
                                                {props.titleDocLink && (
                                                    <StackItem>
                                                        <Button
                                                            icon={<ExternalLinkAltIcon />}
                                                            variant="link"
                                                            onClick={() => window.open(props.titleDocLink, '_blank')}
                                                            isInline
                                                        >
                                                            {t('Documentation')}
                                                        </Button>
                                                    </StackItem>
                                                )}
                                            </Stack>
                                        }
                                        position="bottom-start"
                                    >
                                        <Title headingLevel="h1">
                                            {title}
                                            <Button
                                                variant="link"
                                                style={{ padding: 0, marginTop: 1, marginLeft: 8, verticalAlign: 'top' }}
                                            >
                                                <OutlinedQuestionCircleIcon />
                                            </Button>
                                        </Title>
                                    </Popover>
                                ) : (
                                    <Title headingLevel="h1">{title}</Title>
                                )
                            ) : (
                                <Title headingLevel="h1">
                                    <Skeleton width="160px" />
                                </Title>
                            )}
                            {isMdOrLarger && description && (
                                <Text component="p" style={{ paddingTop: xl ? 4 : 2 }}>
                                    <Truncate content={description} />
                                </Text>
                            )}
                        </FlexItem>
                        {title && (pageActions || controls) && (
                            <Flex
                                direction={{ default: 'column' }}
                                spaceItems={{ default: 'spaceItemsSm', xl: 'spaceItemsMd' }}
                                justifyContent={{ default: 'justifyContentCenter' }}
                            >
                                {controls && <FlexItem grow={{ default: 'grow' }}>{controls}</FlexItem>}
                                {pageActions && <FlexItem>{pageActions}</FlexItem>}
                            </Flex>
                        )}
                    </Flex>
                </PageSection>
            )}
        </>
    )
}
