import { compose } from 'recompose';
import { connect } from 'react-redux';

import HeaderView from './HeaderView';
import { toggleSidebar } from '../Layout/LayoutState';

export default compose(
  connect(
    state => ({
      isSidebarOpened: state.layout.isSidebarOpened,
    }),
    { toggleSidebar },
  )
)(HeaderView);