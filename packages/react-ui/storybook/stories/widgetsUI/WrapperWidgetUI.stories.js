import React from 'react';
import ColorizeIcon from '@mui/icons-material/Colorize';
import MenuIcon from '@mui/icons-material/Menu';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import WrapperWidgetUI from '.../../../src/widgets/WrapperWidgetUI';
import { Label, ThinContainer } from '../../utils/storyStyles';
import { Checkbox } from '@mui/material';

const options = {
  title: 'Widgets/WrapperWidgetUI',
  component: WrapperWidgetUI,
  argTypes: {
    actions: {
      table: { disable: true }
    },
    options: {
      table: { disable: true }
    },
    children: {
      table: { disable: true }
    }
  },
  parameters: {
    docs: {
      source: {
        type: 'auto'
      }
    }
  }
};
export default options;

const Template = (args) => (
  <WrapperWidgetUI {...args}>
    <div>Your Content</div>
  </WrapperWidgetUI>
);

const ResponsiveTemplate = (args) => {
  return (
    <>
      <Label variant='body1' mb={3}>
        {'Limited width'}
      </Label>
      <ThinContainer>
        <WrapperWidgetUI {...args}>
          <div>Your Content</div>
        </WrapperWidgetUI>
      </ThinContainer>

      <Label variant='body1' mt={8} mb={3}>
        {'Responsive'}
      </Label>
      <WrapperWidgetUI {...args}>
        <div>Your Content</div>
      </WrapperWidgetUI>
    </>
  );
};

export const Default = Template.bind({});
const DefaultProps = { title: 'Default wrapper' };
Default.args = DefaultProps;

export const OnlyTitle = Template.bind({});
OnlyTitle.args = DefaultProps;

export const LongTitle = ResponsiveTemplate.bind({});

LongTitle.args = {
  title: 'Default wrapper with extra long text overflowing in two lines',
  options: [
    { id: 'o1', name: 'Option 1', action: () => alert('Option 1!') },
    { id: 'o2', name: 'Option 2 too long', action: () => alert('Option 2!') }
  ]
};

export const Expandable = Template.bind({});
const ExpandableProps = { title: 'Expandable', expandable: true };
Expandable.args = ExpandableProps;

export const NotExpanded = Template.bind({});
const NotExpandedProps = { title: 'Not expanded/collapsed', expanded: false };
NotExpanded.args = NotExpandedProps;

export const NotExpandable = Template.bind({});
const NotExpandableProps = { title: 'Not Expandable', expandable: false };
NotExpandable.args = NotExpandableProps;

export const Loading = Template.bind({});
const LoadingProps = { title: 'Loading', isLoading: true };
Loading.args = LoadingProps;

export const Disabled = Template.bind({});
const DisabledProps = { title: 'Disabled', disabled: true };
Disabled.args = DisabledProps;

export const WithHeaderItems = Template.bind({});
WithHeaderItems.args = {
  title: 'Wrapper with Header Items',
  headerItems: <Checkbox />
};

export const WithActions = Template.bind({});
WithActions.args = {
  title: 'Wrapper with actions',
  actions: [
    {
      id: 'a1',
      name: 'Autostyle',
      icon: <ColorizeIcon />,
      action: () => alert('Action!')
    }
  ]
};

export const WithOptions = Template.bind({});
WithOptions.args = {
  title: 'Wrapper with options',
  options: [
    { id: 'o1', name: 'Option 1', action: () => alert('Option 1!') },
    { id: 'o2', name: 'Option 2 too long', action: () => alert('Option 2!') },
    { id: 'o3', name: 'Option 2', action: () => alert('Option 2!') },
    { id: 'o4', name: 'Option 2 too long here', action: () => alert('Option 2!') },
    { id: 'o5', name: 'Option 2', action: () => alert('Option 2!') },
    { id: 'o6', name: 'Option 2', action: () => alert('Option 2!') },
    { id: 'o7', name: 'Option 2', action: () => alert('Option 2!') },
    { id: 'o8', name: 'Option 2', action: () => alert('Option 2!') },
    { id: 'o9', name: 'Option 2', action: () => alert('Option 2!') }
  ]
};

export const WithItemsActionsAndOptions = Template.bind({});
WithItemsActionsAndOptions.args = {
  title: 'Wrapper with actions and options',
  headerItems: <Checkbox />,
  actions: [
    {
      id: 'a1',
      name: 'Autostyle',
      icon: <ColorizeIcon />,
      action: () => alert('Action!')
    }
  ],
  options: [
    { id: 'o1', name: 'Option 1', action: () => alert('Option 1!') },
    { id: 'o2', name: 'Option 2', action: () => alert('Option 2!') }
  ]
};

export const WithOptionsAndCustomIcon = Template.bind({});
WithOptionsAndCustomIcon.args = {
  title: 'Wrapper with options and custom icon',
  options: [
    { id: 'o1', name: 'Option 1', action: () => alert('Option 1!') },
    { id: 'o2', name: 'Option 2', action: () => alert('Option 2!') }
  ],
  optionsIcon: <MenuIcon />
};

export const WithCustomMargins = Template.bind({});
WithCustomMargins.args = {
  title: 'Wrapper custom margins',
  margin: 100
};

export const WithActionsTooltip = Template.bind({});
WithActionsTooltip.args = {
  title:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
  actions: [
    {
      id: 'a1',
      name: 'Autostyle',
      icon: <ColorizeIcon />,
      action: () => alert('Action!'),
      tooltip: {
        text: 'Tooltip default'
      }
    },
    {
      id: 'a2',
      name: 'Autostyle',
      icon: <AddLocationIcon />,
      action: () => alert('Action!'),
      tooltip: {
        text: 'Tooltip on bottom',
        placement: 'bottom'
      }
    }
  ]
};

export const BigScrollableContent = (args) => (
  <WrapperWidgetUI {...args}>
    <div>
      <p>
        Note: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam, mi nibh
        fames rhoncus id ultricies. Faucibus enim commodo morbi amet sit eget. Ut
        pellentesque tellus iaculis diam. Ornare convallis dictum purus quisque nisl.
      </p>
      <p>
        Vivamus imperdiet, urna eu blandit lobortis, tortor risus sodales urna, sit amet
        tempor eros elit faucibus nulla. Donec vel tellus nec nibh molestie hendrerit.
        Donec nulla massa, interdum ut nisl non, sollicitudin condimentum leo. Integer
        eget accumsan sem. Aliquam tincidunt turpis et leo ac.
      </p>
      <p>
        Vivamus imperdiet, urna eu blandit lobortis, tortor risus sodales urna, sit amet
        tempor eros elit faucibus nulla. Donec vel tellus nec nibh molestie hendrerit.
        Donec nulla massa, interdum ut nisl non, sollicitudin condimentum leo. Integer
        eget accumsan sem. Aliquam tincidunt turpis et leo ac.
      </p>
    </div>
  </WrapperWidgetUI>
);
BigScrollableContent.args = {
  title: 'Big scrollable content',
  expandable: true,
  contentProps: {
    style: {
      overflowY: 'scroll',
      maxHeight: '200px'
    }
  }
};
