import { connect } from 'react-redux';
import { moduleName } from '../index';
import { actions } from '../modules';
import View from '../components';
import { dict } from '../../../../store/dict';

const mapStateToProps = (state) => {
  const localState = state[moduleName];
  return {
    ...localState,
    permission: state.common.permission[state.common.selectedKeys[0]] || {},
    dicts: state.dict,
  };
};

const mapDispatchToProps = {
  ...actions,
  dict,
};

export default connect(mapStateToProps, mapDispatchToProps)(View);
